import { 
  TranscriptionProvider, 
  TranscriptionService, 
  TranscriptionConfig, 
  TranscriptionStatus 
} from './providers/types'

export class TranscriptionServiceImpl implements TranscriptionService {
  private providers: Map<string, TranscriptionProvider>
  private defaultProvider: string

  constructor() {
    this.providers = new Map()
    this.defaultProvider = 'assemblyai'
  }

  registerProvider(provider: TranscriptionProvider): void {
    this.providers.set(provider.name, provider)
  }

  async transcribe(
    meetingId: string, 
    audioUrl: string, 
    config?: TranscriptionConfig
  ): Promise<void> {
    const provider = this.providers.get(this.defaultProvider)
    if (!provider) {
      throw new Error('No transcription provider available')
    }

    await provider.initialize(config)
    await provider.transcribe(meetingId, audioUrl)
  }

  async getStatus(meetingId: string): Promise<TranscriptionStatus> {
    const provider = this.providers.get(this.defaultProvider)
    if (!provider) {
      throw new Error('No transcription provider available')
    }

    return provider.getStatus(meetingId)
  }
} 