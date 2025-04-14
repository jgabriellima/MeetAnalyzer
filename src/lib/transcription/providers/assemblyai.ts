import { TranscriptionProvider, TranscriptionConfig, TranscriptionStatus, TranscriptionFeatures } from './types';
import { createSSRClient } from '../../supabase/server';

export class AssemblyAIProvider implements TranscriptionProvider {
    name = 'assemblyai';
    features: TranscriptionFeatures = {
        speakerLabels: true,
        entityDetection: true,
        topicDetection: true,
        sentimentAnalysis: true,
        chapterDetection: true,
        autoHighlights: true
    };

    private apiKey: string;
    private baseUrl = 'https://api.assemblyai.com/v2';
    private config?: TranscriptionConfig;
    private supabase = createSSRClient();

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async initialize(config?: TranscriptionConfig): Promise<void> {
        this.config = config;
    }

    async transcribe(meetingId: string, audioUrl: string): Promise<void> {
        try {
            // Create transcription request
            const response = await fetch(`${this.baseUrl}/transcript`, {
                method: 'POST',
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audio_url: audioUrl,
                    language_code: this.config?.language || 'pt',
                    speaker_labels: this.config?.speakerLabels ?? true,
                    entity_detection: this.config?.entityDetection ?? true,
                    auto_chapters: this.config?.chapterDetection ?? true,
                    auto_highlights: this.config?.autoHighlights ?? true,
                    sentiment_analysis: this.config?.sentimentAnalysis ?? true,
                    iab_categories: this.config?.topicDetection ?? true,
                    webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/assemblyai`,
                    webhook_auth_header_name: 'X-Webhook-Secret',
                    webhook_auth_header_value: process.env.ASSEMBLYAI_WEBHOOK_SECRET
                })
            });

            if (!response.ok) {
                throw new Error(`AssemblyAI API error: ${response.statusText}`);
            }

            const data = await response.json();

            // Store transcription ID
            await this.supabase
                .from('meetings')
                .update({ 
                    transcription_id: data.id,
                    transcription_status: 'processing'
                })
                .eq('id', meetingId);

        } catch (error) {
            console.error('Error starting transcription:', error);
            await this.supabase
                .from('meetings')
                .update({ 
                    transcription_status: 'error',
                    transcription_error: error instanceof Error ? error.message : 'Unknown error'
                })
                .eq('id', meetingId);
            throw error;
        }
    }

    async getStatus(meetingId: string): Promise<TranscriptionStatus> {
        try {
            // Get transcription ID
            const { data: meeting, error } = await this.supabase
                .from('meetings')
                .select('transcription_id')
                .eq('id', meetingId)
                .single();

            if (error || !meeting?.transcription_id) {
                throw new Error('Transcription ID not found');
            }

            // Check status with AssemblyAI
            const response = await fetch(`${this.baseUrl}/transcript/${meeting.transcription_id}`, {
                headers: {
                    'Authorization': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`AssemblyAI API error: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                status: data.status,
                progress: data.progress,
                error: data.error
            };
        } catch (error) {
            console.error('Error checking transcription status:', error);
            return {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async handleWebhook(payload: any): Promise<void> {
        const { transcript_id, status, text, words, sentiment_analysis_results, iab_categories_result, auto_highlights_result, chapters } = payload;

        try {
            // Get meeting by transcription ID
            const { data: meeting, error } = await this.supabase
                .from('meetings')
                .select('id')
                .eq('transcription_id', transcript_id)
                .single();

            if (error || !meeting) {
                throw new Error('Meeting not found');
            }

            // Update meeting status
            await this.supabase
                .from('meetings')
                .update({ 
                    transcription_status: status,
                    transcription_completed_at: status === 'completed' ? new Date().toISOString() : null
                })
                .eq('id', meeting.id);

            if (status === 'completed') {
                // Store segments
                if (words?.length) {
                    const segments = words.map((word: any) => ({
                        meeting_id: meeting.id,
                        start: word.start,
                        end: word.end,
                        text: word.text,
                        speaker: word.speaker,
                        confidence: word.confidence
                    }));

                    await this.supabase
                        .from('transcription_segments')
                        .upsert(segments);
                }

                // Store metadata
                const metadata = [];

                // Add sentiment analysis
                if (sentiment_analysis_results?.length) {
                    metadata.push({
                        meeting_id: meeting.id,
                        type: 'sentiment',
                        value: JSON.stringify(sentiment_analysis_results),
                        confidence: 1
                    });
                }

                // Add topics
                if (iab_categories_result?.results?.length) {
                    metadata.push(...iab_categories_result.results.map((topic: any) => ({
                        meeting_id: meeting.id,
                        type: 'topic',
                        value: topic.label,
                        confidence: topic.confidence
                    })));
                }

                // Add highlights
                if (auto_highlights_result?.results?.length) {
                    metadata.push(...auto_highlights_result.results.map((highlight: any) => ({
                        meeting_id: meeting.id,
                        type: 'highlight',
                        value: highlight.text,
                        confidence: highlight.confidence,
                        start: highlight.start,
                        end: highlight.end
                    })));
                }

                // Add chapters
                if (chapters?.length) {
                    metadata.push(...chapters.map((chapter: any) => ({
                        meeting_id: meeting.id,
                        type: 'chapter',
                        value: chapter.headline,
                        confidence: 1,
                        start: chapter.start,
                        end: chapter.end
                    })));
                }

                if (metadata.length) {
                    await this.supabase
                        .from('transcription_metadata')
                        .upsert(metadata);
                }
            }
        } catch (error) {
            console.error('Error handling webhook:', error);
            throw error;
        }
    }
} 