import { BaseTranscriptionProvider } from './base-provider';
import { TranscriptionFeature, TranscriptionResult, TranscriptionSegment, Speaker, Topic, Entity } from './types';

interface AssemblyAITranscribeOptions {
  language_code?: string;
  speaker_labels?: boolean;
  entity_detection?: boolean;
  auto_highlights?: boolean;
  sentiment_analysis?: boolean;
}

interface AssemblyAITranscriptionResponse {
  id: string;
  status: string;
  text: string;
  words: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: string;
  }>;
  utterances?: Array<{
    speaker: string;
    text: string;
    start: number;
    end: number;
  }>;
  segments: Array<{
    id: string;
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: string;
    sentiment?: string;
  }>;
  speakers?: Array<{
    speaker: string;
  }>;
  entities?: Array<{
    entity_type: string;
    text: string;
    start: number;
    end: number;
  }>;
  auto_highlights_result?: {
    results: Array<{
      text: string;
      count: number;
      rank: number;
      timestamps: Array<{
        start: number;
        end: number;
      }>;
    }>;
  };
  language_code: string;
  audio_duration: number;
}

/**
 * AssemblyAI implementation of the transcription provider
 */
export class AssemblyAIProvider extends BaseTranscriptionProvider {
  name = 'AssemblyAI';
  features = [
    TranscriptionFeature.TRANSCRIPTION,
    TranscriptionFeature.DIARIZATION,
    TranscriptionFeature.SENTIMENT,
    TranscriptionFeature.TOPICS,
    TranscriptionFeature.ENTITIES,
  ];
  private apiKey: string;
  private baseUrl = 'https://api.assemblyai.com/v2';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  /**
   * Helper method to make authenticated requests to AssemblyAI
   */
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`AssemblyAI request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Submit an audio file for transcription
   */
  async transcribeAudio(url: string, options?: AssemblyAITranscribeOptions): Promise<TranscriptionResult> {
    const requestOptions = {
      audio_url: url,
      speaker_labels: options?.speaker_labels ?? true,
      entity_detection: options?.entity_detection ?? true,
      auto_highlights: options?.auto_highlights ?? true,
      sentiment_analysis: options?.sentiment_analysis ?? true,
      language_code: options?.language_code,
    };

    const response = await this.makeRequest('/transcript', 'POST', requestOptions);
    
    return {
      id: response.id,
      segments: [],
      speakers: [],
      language: response.language_code || 'en',
      duration: 0,
    };
  }

  /**
   * Check the status of a transcription job
   */
  async getTranscriptionStatus(id: string): Promise<string> {
    const response = await this.makeRequest(`/transcript/${id}`);
    return response.status;
  }

  /**
   * Get a completed transcription
   */
  async getTranscription(id: string): Promise<TranscriptionResult> {
    const response: AssemblyAITranscriptionResponse = await this.makeRequest(`/transcript/${id}`);
    
    if (response.status !== 'completed') {
      throw new Error(`Transcription not completed. Status: ${response.status}`);
    }

    // Map AssemblyAI response to our standard format
    const segments: TranscriptionSegment[] = response.segments.map(segment => ({
      id: segment.id,
      start: segment.start,
      end: segment.end,
      text: segment.text,
      speakerId: segment.speaker,
      sentiment: segment.sentiment,
      confidence: segment.confidence,
    }));

    // Extract speakers
    const speakers: Speaker[] = response.speakers
      ? response.speakers.map((speaker, index) => ({
          id: speaker.speaker,
          name: `Speaker ${index + 1}`,
        }))
      : [];

    // Extract topics from auto_highlights if available
    const topics: Topic[] = response.auto_highlights_result
      ? response.auto_highlights_result.results.map((highlight, index) => {
          // Find segments that contain this topic
          const topicSegments = response.segments
            .filter(segment => 
              highlight.timestamps.some(
                timestamp => timestamp.start >= segment.start && timestamp.end <= segment.end
              )
            )
            .map(segment => segment.id);

          return {
            id: `topic_${index}`,
            name: highlight.text,
            relevance: highlight.rank / 10, // Normalize rank to 0-1 scale
            segments: topicSegments,
          };
        })
      : [];

    // Extract entities if available
    const entities: Entity[] = response.entities
      ? response.entities.map((entity, index) => {
          // Find segments that contain this entity
          const entitySegments = response.segments
            .filter(segment => 
              entity.start >= segment.start && entity.end <= segment.end
            )
            .map(segment => segment.id);

          return {
            id: `entity_${index}`,
            name: entity.text,
            type: entity.entity_type,
            segments: entitySegments,
          };
        })
      : [];

    return {
      id,
      segments,
      speakers,
      language: response.language_code,
      topics: topics.length > 0 ? topics : undefined,
      entities: entities.length > 0 ? entities : undefined,
      duration: response.audio_duration,
    };
  }
} 