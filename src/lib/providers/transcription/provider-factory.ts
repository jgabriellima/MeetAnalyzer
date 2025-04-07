import { ITranscriptionProvider, TranscriptionFeature, TranscriptionProviderConfig } from './types';
import { AssemblyAIProvider } from './assemblyai-provider';

export type ProviderConfigMap = {
  [key: string]: TranscriptionProviderConfig;
};

/**
 * Configuration for the transcription provider factory
 */
export interface TranscriptionFactoryConfig {
  default: string;
  providers: ProviderConfigMap;
}

/**
 * Factory for creating transcription providers
 */
export class TranscriptionProviderFactory {
  private config: TranscriptionFactoryConfig;
  private providers: Map<string, ITranscriptionProvider> = new Map();

  constructor(config: TranscriptionFactoryConfig) {
    this.config = config;
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(): ITranscriptionProvider {
    const defaultProviderName = this.config.default;
    return this.getProvider(defaultProviderName);
  }

  /**
   * Get a provider by name
   */
  getProvider(name: string): ITranscriptionProvider {
    // Check if provider already instantiated
    if (this.providers.has(name)) {
      return this.providers.get(name)!;
    }

    // Get provider config
    const providerConfig = this.config.providers[name];
    if (!providerConfig || !providerConfig.enabled) {
      throw new Error(`Provider ${name} is not enabled or does not exist`);
    }

    // Create provider instance
    let provider: ITranscriptionProvider;
    switch (name) {
      case 'assemblyai':
        if (!process.env.ASSEMBLYAI_API_KEY) {
          throw new Error('AssemblyAI API key not found in environment variables');
        }
        provider = new AssemblyAIProvider(process.env.ASSEMBLYAI_API_KEY);
        break;
      // Add cases for other providers like Whisper, Google Speech-to-Text, etc.
      default:
        throw new Error(`Unknown provider: ${name}`);
    }

    // Cache the provider instance
    this.providers.set(name, provider);
    return provider;
  }

  /**
   * Get a provider that supports specific features
   * Falls back to other providers if the default doesn't support required features
   */
  getProviderWithFeatures(requiredFeatures: TranscriptionFeature[]): ITranscriptionProvider {
    // Try the default provider first
    try {
      const defaultProvider = this.getDefaultProvider();
      const hasMissingFeatures = requiredFeatures.some(
        feature => !defaultProvider.hasFeature(feature)
      );

      if (!hasMissingFeatures) {
        return defaultProvider;
      }
    } catch (error) {
      // Default provider not available, continue to try others
      console.warn('Default provider not available:', error);
    }

    // Try to find another provider with all required features
    const enabledProviderNames = Object.keys(this.config.providers).filter(
      name => this.config.providers[name].enabled
    );

    for (const name of enabledProviderNames) {
      try {
        const provider = this.getProvider(name);
        const hasMissingFeatures = requiredFeatures.some(
          feature => !provider.hasFeature(feature)
        );

        if (!hasMissingFeatures) {
          return provider;
        }
      } catch (error) {
        // Provider not available, continue to try others
        console.warn(`Provider ${name} not available:`, error);
      }
    }

    throw new Error(`No provider available with required features: ${requiredFeatures.join(', ')}`);
  }
} 