#!/usr/bin/env node

/**
 * Setup script to store GuessOps secrets in AWS Systems Manager Parameter Store
 * Run with: node setup-secrets.js
 */

const { SSMClient, PutParameterCommand, GetParameterCommand } = require('@aws-sdk/client-ssm');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION || 'us-west-2'
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let input = '';
    process.stdin.on('data', (char) => {
      char = char.toString();
      
      if (char === '\n' || char === '\r' || char === '\u0004') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\n');
        resolve(input);
      } else if (char === '\u0003') {
        process.exit(1);
      } else if (char === '\u007f' || char === '\b') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        input += char;
        process.stdout.write('*');
      }
    });
  });
}

async function putParameter(name, value, description, isSecure = true) {
  try {
    const command = new PutParameterCommand({
      Name: name,
      Value: value,
      Type: isSecure ? 'SecureString' : 'String',
      Description: description,
      Overwrite: true
    });

    await ssmClient.send(command);
    console.log(`✅ Successfully stored: ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to store ${name}:`, error.message);
    return false;
  }
}

async function getParameter(name) {
  try {
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });

    const response = await ssmClient.send(command);
    return response.Parameter?.Value || null;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🔐 GuessOps AWS Secrets Setup');
  console.log('===============================\n');

  console.log('This script will help you securely store API keys in AWS Systems Manager Parameter Store.');
  console.log('Make sure you have AWS credentials configured with SSM permissions.\n');

  const proceed = await question('Do you want to continue? (y/N): ');
  if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  console.log('\n📋 Configuration Options:\n');

  // LLM Provider
  console.log('1. LLM Provider (openai or bedrock):');
  const currentProvider = await getParameter('/guessops/llm-provider');
  if (currentProvider) {
    console.log(`   Current: ${currentProvider}`);
  }
  
  const provider = await question(`   Enter LLM provider [${currentProvider || 'bedrock'}]: `) || currentProvider || 'bedrock';
  
  if (!['openai', 'bedrock'].includes(provider)) {
    console.log('❌ Invalid provider. Must be "openai" or "bedrock"');
    rl.close();
    return;
  }

  // Store provider
  await putParameter(
    '/guessops/llm-provider',
    provider,
    'LLM provider for GuessOps (openai or bedrock)',
    false
  );

  // OpenAI API Key (if using OpenAI)
  if (provider === 'openai') {
    console.log('\n2. OpenAI API Key:');
    const currentKey = await getParameter('/guessops/openai-api-key');
    if (currentKey) {
      console.log('   Current: sk-***...***');
    }
    
    const updateKey = await question('   Update OpenAI API key? (y/N): ');
    if (updateKey.toLowerCase() === 'y' || updateKey.toLowerCase() === 'yes' || !currentKey) {
      const apiKey = await questionHidden('   Enter OpenAI API Key (hidden): ');
      
      if (apiKey && apiKey.startsWith('sk-')) {
        await putParameter(
          '/guessops/openai-api-key',
          apiKey,
          'OpenAI API key for GuessOps question generation',
          true
        );
      } else {
        console.log('❌ Invalid OpenAI API key format');
      }
    }

    // Model
    const currentModel = await getParameter('/guessops/llm-model');
    const model = await question(`   Enter OpenAI model [${currentModel || 'gpt-4o-mini'}]: `) || currentModel || 'gpt-4o-mini';
    
    await putParameter(
      '/guessops/llm-model',
      model,
      'OpenAI model for GuessOps',
      false
    );
  }

  // Bedrock Configuration (if using Bedrock)
  if (provider === 'bedrock') {
    console.log('\n2. AWS Bedrock Configuration:');
    
    // Region
    const currentRegion = await getParameter('/guessops/bedrock-region');
    const region = await question(`   Enter Bedrock region [${currentRegion || 'us-west-2'}]: `) || currentRegion || 'us-west-2';
    
    await putParameter(
      '/guessops/bedrock-region',
      region,
      'AWS Bedrock region for GuessOps',
      false
    );

    // Model
    const currentModel = await getParameter('/guessops/llm-model');
    console.log('\n   Available Bedrock models:');
    console.log('   - anthropic.claude-3-haiku-20240307-v1:0 (recommended, cost-effective)');
    console.log('   - anthropic.claude-3-5-sonnet-20241022-v2:0 (balanced)');
    console.log('   - anthropic.claude-3-opus-20240229-v1:0 (most capable)');
    
    const model = await question(`   Enter Bedrock model [${currentModel || 'anthropic.claude-3-haiku-20240307-v1:0'}]: `) || currentModel || 'anthropic.claude-3-haiku-20240307-v1:0';
    
    await putParameter(
      '/guessops/llm-model',
      model,
      'Bedrock model for GuessOps',
      false
    );
  }

  console.log('\n🎉 Setup Complete!');
  console.log('\nYour API keys are now securely stored in AWS Systems Manager Parameter Store.');
  console.log('The GuessOps application will automatically retrieve them when needed.\n');

  console.log('📋 Summary:');
  console.log(`   Provider: ${provider}`);
  if (provider === 'bedrock') {
    const region = await getParameter('/guessops/bedrock-region');
    const model = await getParameter('/guessops/llm-model');
    console.log(`   Region: ${region}`);
    console.log(`   Model: ${model}`);
  } else {
    const model = await getParameter('/guessops/llm-model');
    console.log(`   Model: ${model}`);
    console.log('   API Key: ✅ Stored securely');
  }

  console.log('\n🚀 You can now run: npm run dev');
  
  rl.close();
}

main().catch(console.error);
