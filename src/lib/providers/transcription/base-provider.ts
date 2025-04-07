import { ITranscriptionProvider, TranscriptionFeature, TranscriptionResult } from './types';

/**
 * Base class for transcription providers to inherit from
 */
export abstract class BaseTranscriptionProvider implements ITranscriptionProvider {
  /**
   * The name of the provider
   */
  abstract name: string;

  /**
   * The features supported by this provider
   */
  abstract features: TranscriptionFeature[];

  /**
   * Check if the provider has a specific capability
   */
  hasFeature(feature: TranscriptionFeature): boolean {
    return this.features.includes(feature);
  }

  /**
   * Transcribe audio from a URL
   * This must be implemented by the provider
   */
  abstract transcribeAudio(url: string, options?: any): Promise<TranscriptionResult>;

  /**
   * Check the status of a transcription job
   * This must be implemented by the provider
   */
  abstract getTranscriptionStatus(id: string): Promise<string>;

  /**
   * Get a completed transcription
   * This must be implemented by the provider
   */
  abstract getTranscription(id: string): Promise<TranscriptionResult>;

  /**
   * Validate that required features are supported
   * @param requiredFeatures The features that are required
   * @throws Error if any required feature is not supported
   */
  validateFeatures(requiredFeatures: TranscriptionFeature[]): void {
    const missingFeatures = requiredFeatures.filter(
      feature => !this.hasFeature(feature)
    );

    if (missingFeatures.length > 0) {
      throw new Error(
        `Provider ${this.name} does not support required features: ${missingFeatures.join(', ')}`
      );
    }
  }
} 