import { Database } from '../types';

export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type TranscriptionSegment = Database['public']['Tables']['transcription_segments']['Row'];
export type TranscriptionMetadata = Database['public']['Tables']['transcription_metadata']['Row'];
export type TranscriptionSpeaker = Database['public']['Tables']['transcription_speakers']['Row'];

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface TranscriptionConfig {
    language?: string;
    speaker_labels?: boolean;
    entity_detection?: boolean;
    iab_categories?: boolean;
    auto_chapters?: boolean;
    auto_highlights?: boolean;
    sentiment_analysis?: boolean;
    redact_pii?: boolean;
    language_detection?: boolean;
    word_boost?: string[];
    boost_param?: 'high' | 'low';
    disfluencies?: boolean;
    filter_profanity?: boolean;
    punctuate?: boolean;
    format_text?: boolean;
    audio_start_from?: number;
    audio_end_at?: number;
    speech_threshold?: number;
    custom_spelling?: Array<{ from: string[]; to: string; }>;
}

export interface TranscriptionProvider {
    name: string;
    features: TranscriptionFeatures;
    initialize(config: TranscriptionConfig): Promise<void>;
    transcribe(meetingId: string, audioUrl: string, config?: TranscriptionConfig): Promise<void>;
    getStatus(meetingId: string): Promise<TranscriptionStatus>;
    handleWebhook(payload: any): Promise<void>;
}

export interface TranscriptionFeatures {
    realtime: boolean;
    speaker_labels: boolean;
    entity_detection: boolean;
    iab_categories: boolean;
    auto_chapters: boolean;
    auto_highlights: boolean;
    sentiment_analysis: boolean;
    redact_pii: boolean;
    language_detection: boolean;
    word_boost: boolean;
    custom_spelling: boolean;
    disfluencies: boolean;
    filter_profanity: boolean;
    punctuate: boolean;
    format_text: boolean;
    partial_audio: boolean;
    speech_threshold: boolean;
}

export interface TranscriptionResult {
    id: string;
    text: string;
    language?: string;
    confidence: number;
    segments: TranscriptionSegment[];
    speakers: TranscriptionSpeaker[];
    metadata: {
        entities?: any[];
        topics?: any[];
        sentiment?: any;
        chapters?: any[];
        highlights?: any[];
    };
}

export interface TranscriptionError {
    code: string;
    message: string;
    details?: any;
}

export interface TranscriptionWebhookPayload {
    meeting_id: string;
    status: TranscriptionStatus;
    result?: TranscriptionResult;
    error?: TranscriptionError;
}

export interface TranscriptionService {
    getProvider(name?: string): TranscriptionProvider;
    registerProvider(provider: TranscriptionProvider): void;
    transcribe(meetingId: string, config?: TranscriptionConfig): Promise<void>;
    getStatus(meetingId: string): Promise<TranscriptionStatus>;
    handleWebhook(payload: TranscriptionWebhookPayload): Promise<void>;
} 