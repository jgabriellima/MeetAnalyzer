import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== Deno.env.get('ASSEMBLYAI_WEBHOOK_SECRET')) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const payload = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get meeting_id from transcription_id
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id')
      .eq('transcription_id', payload.transcript_id)
      .single();

    if (meetingError || !meeting) {
      throw new Error(`Meeting not found for transcription_id: ${payload.transcript_id}`);
    }

    // Process based on status
    switch (payload.status) {
      case 'completed':
        // Update meeting
        await supabase
          .from('meetings')
          .update({
            transcription_status: 'completed',
            transcript: payload.text,
            language: payload.language_code
          })
          .eq('id', meeting.id);

        // Insert segments if they exist
        if (payload.words?.length > 0) {
          const segments = payload.words.map((word: any) => ({
            meeting_id: meeting.id,
            start_time: word.start,
            end_time: word.end,
            text: word.text,
            speaker: word.speaker,
            confidence: word.confidence
          }));

          const { error: segmentsError } = await supabase
            .from('transcription_segments')
            .insert(segments);

          if (segmentsError) {
            console.error('Error inserting segments:', segmentsError);
          }
        }
        break;

      case 'error':
        await supabase
          .from('meetings')
          .update({
            transcription_status: 'error',
            error_message: payload.error
          })
          .eq('id', meeting.id);
        break;

      default:
        // Update intermediate status if needed
        await supabase
          .from('meetings')
          .update({
            transcription_status: payload.status
          })
          .eq('id', meeting.id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 