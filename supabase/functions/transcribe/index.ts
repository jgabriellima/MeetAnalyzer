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
    const { meeting_id, audio_url } = await req.json();
    
    // Validate inputs
    if (!meeting_id || !audio_url) {
      throw new Error('meeting_id and audio_url are required');
    }

    // Initialize AssemblyAI transcription
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('ASSEMBLYAI_API_KEY') ?? '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url,
        webhook_url: `${Deno.env.get('PUBLIC_URL')}/functions/v1/assemblyai-webhook`,
        webhook_auth_header_name: 'X-Webhook-Secret',
        webhook_auth_header_value: Deno.env.get('ASSEMBLYAI_WEBHOOK_SECRET'),
        speaker_labels: true,
        language_detection: true
      })
    });

    if (!response.ok) {
      throw new Error(`AssemblyAI API error: ${response.statusText}`);
    }

    const transcript = await response.json();

    // Update meeting status in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        transcription_id: transcript.id,
        transcription_status: 'processing'
      })
      .eq('id', meeting_id);

    if (updateError) {
      throw new Error(`Supabase update error: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        transcription_id: transcript.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Transcription error:', error);
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