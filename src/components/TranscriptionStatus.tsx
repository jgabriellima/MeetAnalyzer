import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types';

type TranscriptionStatus = Database['public']['Enums']['transcription_status'];

interface Props {
  meetingId: string;
}

export function TranscriptionStatus({ meetingId }: Props) {
  const [status, setStatus] = useState<TranscriptionStatus>();
  const [error, setError] = useState<string>();
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial status
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('transcription_status, error_message')
        .eq('id', meetingId)
        .single();

      if (error) {
        console.error('Error fetching status:', error);
        return;
      }

      setStatus(data.transcription_status);
      setError(data.error_message);
    };

    fetchStatus();

    // Subscribe to changes
    const channel = supabase
      .channel(`meeting_${meetingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meetings',
          filter: `id=eq.${meetingId}`
        },
        (payload) => {
          const meeting = payload.new as Database['public']['Tables']['meetings']['Row'];
          setStatus(meeting.transcription_status);
          setError(meeting.error_message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, supabase]);

  if (!status) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <StatusIcon status={status} />
        <span className="font-medium">
          {getStatusMessage(status)}
        </span>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          Error: {error}
        </p>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: TranscriptionStatus }) {
  switch (status) {
    case 'uploaded':
      return <span className="h-2 w-2 rounded-full bg-yellow-400" />;
    case 'processing':
      return <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />;
    case 'completed':
      return <span className="h-2 w-2 rounded-full bg-green-400" />;
    case 'error':
      return <span className="h-2 w-2 rounded-full bg-red-400" />;
    default:
      return null;
  }
}

function getStatusMessage(status: TranscriptionStatus): string {
  switch (status) {
    case 'uploaded':
      return 'Audio uploaded, waiting to start...';
    case 'processing':
      return 'Transcribing audio...';
    case 'completed':
      return 'Transcription completed';
    case 'error':
      return 'Transcription failed';
    default:
      return 'Unknown status';
  }
} 