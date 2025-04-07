// Export types
export * from './types';

// Export base provider
export * from './base-provider';

// Export concrete providers
export * from './assemblyai-provider';

// Export factory
export * from './provider-factory';

// Default configuration
export const defaultTranscriptionConfig = {
  default: 'assemblyai',
  providers: {
    assemblyai: {
      enabled: true,
      features: [
        'transcription',
        'diarization',
        'sentiment',
        'topics',
        'entities'
      ],
    },
    // Add other providers here when implemented
  }
}; 