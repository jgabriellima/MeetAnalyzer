/**
 * Defines the capabilities of a transcription provider
 */
export enum TranscriptionFeature {
  TRANSCRIPTION = 'transcription',
  DIARIZATION = 'diarization',
  SENTIMENT = 'sentiment',
  TOPICS = 'topics',
  ENTITIES = 'entities',
  TRANSLATION = 'translation',
}

/**
 * Represents a participant in the transcription
 */
export interface Speaker {
  id: string;
  name?: string;
}

/**
 * Represents a segment of the transcription
 */
export interface TranscriptionSegment {
  id: string;
  start: number; // in milliseconds
  end: number; // in milliseconds
  text: string;
  speakerId?: string;
  sentiment?: string;
  confidence?: number;
}

/**
 * Represents a topic identified in the transcription
 */
export interface Topic {
  id: string;
  name: string;
  relevance: number; // 0-1 score
  segments: string[]; // IDs of segments related to this topic
}

/**
 * Represents an entity identified in the transcription
 */
export interface Entity {
  id: string;
  name: string;
  type: string;
  segments: string[]; // IDs of segments where this entity appears
}

/**
 * Represents the result of a transcription
 */
export interface TranscriptionResult {
  id: string;
  segments: TranscriptionSegment[];
  speakers: Speaker[];
  language: string;
  topics?: Topic[];
  entities?: Entity[];
  duration: number; // in milliseconds
}

/**
 * Configuration for a transcription provider
 */
export interface TranscriptionProviderConfig {
  enabled: boolean;
  features: TranscriptionFeature[];
  apiKey?: string;
  endpoint?: string;
}

/**
 * Base interface for all transcription providers
 */
export interface ITranscriptionProvider {
  /**
   * The name of the provider
   */
  name: string;
  
  /**
   * The features supported by this provider
   */
  features: TranscriptionFeature[];
  
  /**
   * Check if the provider has a specific capability
   */
  hasFeature(feature: TranscriptionFeature): boolean;
  
  /**
   * Transcribe audio from a URL
   */
  transcribeAudio(url: string, options?: any): Promise<TranscriptionResult>;
  
  /**
   * Check the status of a transcription job
   */
  getTranscriptionStatus(id: string): Promise<string>;
  
  /**
   * Get a completed transcription
   */
  getTranscription(id: string): Promise<TranscriptionResult>;
} 