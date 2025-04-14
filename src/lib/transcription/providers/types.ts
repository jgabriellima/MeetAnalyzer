export interface TranscriptionConfig {
  language?: string
  speakerLabels?: boolean
  entityDetection?: boolean
  topicDetection?: boolean
  sentimentAnalysis?: boolean
  chapterDetection?: boolean
  autoHighlights?: boolean
}

export interface TranscriptionStatus {
  status: 'queued' | 'processing' | 'completed' | 'error'
  progress?: number
  error?: string
}

export interface TranscriptionFeatures {
  speakerLabels: boolean
  entityDetection: boolean
  topicDetection: boolean
  sentimentAnalysis: boolean
  chapterDetection: boolean
  autoHighlights: boolean
}

export interface TranscriptionProvider {
  name: string
  features: TranscriptionFeatures

  initialize(config?: TranscriptionConfig): Promise<void>
  transcribe(meetingId: string, audioUrl: string): Promise<void>
  getStatus(meetingId: string): Promise<TranscriptionStatus>
  handleWebhook(payload: any): Promise<void>
}

export interface TranscriptionService {
  registerProvider(provider: TranscriptionProvider): void
  transcribe(meetingId: string, audioUrl: string, config?: TranscriptionConfig): Promise<void>
  getStatus(meetingId: string): Promise<TranscriptionStatus>
} 