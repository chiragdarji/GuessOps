import { NextRequest, NextResponse } from 'next/server';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Initialize Polly client with server-side credentials
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-west-2',
  // Server-side automatically uses AWS CLI credentials or IAM roles
});

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = 'Aditi', rate = '0.9' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    console.log('🔊 Server-side TTS request:', { 
      text: text.substring(0, 50) + '...', 
      voiceId, 
      rate 
    });

    // Prepare Polly parameters
    const params = {
      Text: text,
      OutputFormat: 'mp3' as const,
      VoiceId: voiceId,
      Engine: 'standard' as const,
      SampleRate: '22050',
      TextType: 'text' as const,
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    if (response.AudioStream) {
      // Convert the audio stream to bytes
      const audioBytes = await response.AudioStream.transformToByteArray();
      
      console.log('✅ Polly synthesis successful, audio size:', audioBytes.length, 'bytes');

      // Return the audio as a blob
      return new NextResponse(audioBytes, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBytes.length.toString(),
        },
      });
    } else {
      throw new Error('No audio stream received from Polly');
    }
  } catch (error) {
    console.error('❌ Server-side TTS error:', error);
    return NextResponse.json({ 
      error: 'Text-to-speech synthesis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
