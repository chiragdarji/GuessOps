'use client';

import { PollyClient, SynthesizeSpeechCommand, SynthesizeSpeechCommandInput } from '@aws-sdk/client-polly';

export type VoiceId = 'Aditi' | 'Raveena' | 'Joanna' | 'Matthew' | 'Salli';

export interface VoiceInfo {
  Id: string;
  Name: string;
  Gender: 'Female' | 'Male';
  LanguageCode: string;
}

export interface TTSConfig {
  provider: 'polly' | 'webspeech';
  voiceId?: VoiceId;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSService {
  speak(text: string, config?: Partial<TTSConfig>): Promise<void>;
  stop(): void;
  isSupported(): boolean;
  getAvailableVoices(): Promise<VoiceInfo[]>;
}

class PollyTTSService implements TTSService {
  private pollyClient: PollyClient | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Initialize Polly client with credentials from environment or AWS config
      this.pollyClient = new PollyClient({
        region: process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || 'us-west-2',
        ...(process.env.AWS_ACCESS_KEY_ID && {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
          }
        })
      });
      this.isInitialized = true;
      console.log('✅ AWS Polly client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Polly client:', error);
      this.isInitialized = false;
    }
  }

  async speak(text: string, config: Partial<TTSConfig> = {}): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stop();

      console.log('🔊 Calling server-side TTS API:', { 
        text: text.substring(0, 50) + '...', 
        voiceId: config.voiceId || 'Aditi' 
      });

      // Call server-side TTS API
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: config.voiceId || 'Aditi',
          rate: config.rate || 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS API request failed');
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio element
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = config.volume || 1.0;
      
      // Play the audio
      await this.currentAudio.play();
      
      console.log('✅ Server-side Polly speech synthesis successful');

      // Clean up the blob URL after playing
      this.currentAudio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error('❌ Server-side Polly TTS error:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  isSupported(): boolean {
    // Server-side API is always available (no client-side credentials needed)
    return true;
  }

  async getAvailableVoices(): Promise<VoiceInfo[]> {
    // Return Indian English voices first, then US English as fallback
    return [
      { Id: 'Aditi', Name: 'Aditi', Gender: 'Female', LanguageCode: 'hi-IN' }, // Hindi-Indian English
      { Id: 'Raveena', Name: 'Raveena', Gender: 'Female', LanguageCode: 'hi-IN' }, // Hindi-Indian English
      { Id: 'Joanna', Name: 'Joanna', Gender: 'Female', LanguageCode: 'en-US' },
      { Id: 'Matthew', Name: 'Matthew', Gender: 'Male', LanguageCode: 'en-US' },
      { Id: 'Salli', Name: 'Salli', Gender: 'Female', LanguageCode: 'en-US' }
    ];
  }
}

class WebSpeechTTSService implements TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;

  constructor() {
    // Delay initialization to avoid SSR issues
    this.initializeIfNeeded();
  }

  private initializeIfNeeded() {
    if (!this.isInitialized && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.isInitialized = true;
    }
  }

  async speak(text: string, config: Partial<TTSConfig> = {}): Promise<void> {
    this.initializeIfNeeded();
    if (!this.isSupported() || !this.synthesis) {
      throw new Error('Web Speech API not supported');
    }

    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.stop();

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = 'en-US';
        this.currentUtterance.rate = config.rate || 0.85; // Moderate speed for better understanding
        this.currentUtterance.pitch = config.pitch || 1.0;
        this.currentUtterance.volume = config.volume || 1.0;

        // Try to find a good English voice
        const voices = this.synthesis!.getVoices();
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en-') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.startsWith('en-'));

        if (englishVoice) {
          this.currentUtterance.voice = englishVoice;
        }

        this.currentUtterance.onend = () => {
          console.log('✅ Web Speech synthesis complete');
          resolve();
        };

        this.currentUtterance.onerror = (error) => {
          console.warn('⚠️ Web Speech synthesis error:', error.error || 'Unknown error');
          // Don't reject - just resolve silently to avoid breaking the game
          resolve();
        };

        console.log('🔊 Speaking with Web Speech API:', text.substring(0, 50) + '...');
        this.synthesis!.speak(this.currentUtterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  isSupported(): boolean {
    this.initializeIfNeeded();
    return this.isInitialized && this.synthesis !== null;
  }

  async getAvailableVoices(): Promise<VoiceInfo[]> {
    if (!this.synthesis) return [];
    
    const voices = this.synthesis.getVoices();
    return voices
      .filter(voice => voice.lang.startsWith('en-'))
      .map(voice => ({
        Id: voice.name,
        Name: voice.name,
        Gender: voice.name.toLowerCase().includes('female') ? 'Female' : 'Male',
        LanguageCode: voice.lang
      }));
  }
}

// Main TTS service that handles fallback logic
export class TextToSpeechService {
  private pollyService: PollyTTSService;
  private webSpeechService: WebSpeechTTSService;
  private defaultConfig: TTSConfig = {
    provider: 'polly',
    voiceId: 'Aditi', // Indian English female voice - more natural for Indian audience
    rate: 0.9, // Slightly faster for more natural flow
    pitch: 1.0,
    volume: 1.0
  };

  constructor() {
    this.pollyService = new PollyTTSService();
    this.webSpeechService = new WebSpeechTTSService();
  }

  async speak(text: string, config?: Partial<TTSConfig>): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    console.log('🔊 TTS Request:', { 
      provider: finalConfig.provider, 
      voiceId: finalConfig.voiceId, 
      rate: finalConfig.rate,
      text: text.substring(0, 50) + '...' 
    });

    try {
      // Try Polly first (primary)
      if (finalConfig.provider === 'polly' && this.pollyService.isSupported()) {
        console.log('🎯 Using AWS Polly for TTS');
        await this.pollyService.speak(text, finalConfig);
        return;
      }
    } catch (error) {
      console.warn('🔄 Polly failed, falling back to Web Speech API:', error);
    }

    try {
      // Fallback to Web Speech API
      if (this.webSpeechService.isSupported()) {
        console.log('🎯 Using Web Speech API for TTS (fallback)');
        await this.webSpeechService.speak(text, finalConfig);
        return;
      }
    } catch (error) {
      console.warn('🔄 Web Speech API also failed:', error);
    }

    // If both services fail, log warning but don't throw error
    console.warn('⚠️ Text-to-speech not available - continuing without audio');
    return; // Return silently instead of throwing error
  }

  stop(): void {
    this.pollyService.stop();
    this.webSpeechService.stop();
  }

  updateConfig(config: Partial<TTSConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  async getAvailableVoices(): Promise<{ polly: VoiceInfo[], webSpeech: VoiceInfo[] }> {
    const [pollyVoices, webSpeechVoices] = await Promise.all([
      this.pollyService.getAvailableVoices().catch(() => []),
      this.webSpeechService.getAvailableVoices().catch(() => [])
    ]);

    return {
      polly: pollyVoices,
      webSpeech: webSpeechVoices
    };
  }

  getStatus(): { pollyAvailable: boolean, webSpeechAvailable: boolean } {
    return {
      pollyAvailable: this.pollyService.isSupported(),
      webSpeechAvailable: this.webSpeechService.isSupported()
    };
  }
}

// Export singleton instance
export const textToSpeechService = new TextToSpeechService();
