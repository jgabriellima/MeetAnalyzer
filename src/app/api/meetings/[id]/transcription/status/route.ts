import { NextRequest, NextResponse } from 'next/server';
import { createServerComponent } from '@/lib/supabase/server';
import { TranscriptionServiceImpl } from '@/lib/transcription/service';
import { AssemblyAIProvider } from '@/lib/transcription/providers/assemblyai';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get meeting ID from params
        const { id } = params;

        // Initialize services
        const supabase = await createServerComponent();
        const transcriptionService = new TranscriptionServiceImpl();
        const assemblyAIProvider = new AssemblyAIProvider(
            process.env.ASSEMBLYAI_API_KEY || ''
        );

        // Register provider
        transcriptionService.registerProvider(assemblyAIProvider);

        // Get status
        const status = await transcriptionService.getStatus(id);

        return NextResponse.json({ status });
    } catch (error) {
        console.error('Error getting transcription status:', error);
        return new NextResponse(
            error instanceof Error ? error.message : 'Internal Server Error',
            { status: 500 }
        );
    }
} 