import { NextRequest, NextResponse } from 'next/server';
import { eventBus } from '@/lib/events/eventBus';
import { MeetingEventType, AudioSource } from '@/lib/events/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        // Validate webhook secret
        const webhookSecret = request.headers.get('X-Webhook-Secret');
        if (webhookSecret !== process.env.ASSEMBLYAI_WEBHOOK_SECRET) {
            return NextResponse.json(
                { error: 'Invalid webhook secret' },
                { status: 401 }
            );
        }

        const payload = await request.json();

        // Publish appropriate event based on status
        if (payload.status === 'completed') {
            await eventBus.publish({
                id: uuidv4(),
                type: MeetingEventType.TRANSCRIPTION_COMPLETED,
                meetingId: payload.meeting_id,
                source: AudioSource.WEB_UPLOAD,
                timestamp: new Date(),
                payload
            });
        } else if (payload.status === 'error') {
            await eventBus.publish({
                id: uuidv4(),
                type: MeetingEventType.TRANSCRIPTION_FAILED,
                meetingId: payload.meeting_id,
                source: AudioSource.WEB_UPLOAD,
                timestamp: new Date(),
                payload
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 