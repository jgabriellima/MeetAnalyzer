-- Create transcription status enum
create type transcription_status as enum (
  'uploaded',
  'processing',
  'completed',
  'error'
);

-- Update meetings table
alter table meetings add column if not exists audio_url text;
alter table meetings add column if not exists transcription_id text;
alter table meetings add column if not exists transcription_status transcription_status default 'uploaded';
alter table meetings add column if not exists error_message text;

-- Create transcription segments table
create table if not exists transcription_segments (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid references meetings(id) on delete cascade,
  start_time bigint not null,
  end_time bigint not null,
  text text not null,
  speaker text,
  confidence float,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create function for trigger
create or replace function handle_new_audio_upload()
returns trigger as $$
declare
  edge_function_url text;
begin
  -- Set the edge function URL
  edge_function_url := 'https://iptiidqrqrucyrswbjii.supabase.co/functions/v1/transcribe';

  if NEW.status = 'uploaded' and NEW.transcription_id is null then
    perform
      net.http_post(
        url := edge_function_url,
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || current_setting('app.settings.edge_function_key'),
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'meeting_id', NEW.id,
          'audio_url', NEW.audio_url
        )
      );
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Create trigger
drop trigger if exists on_audio_upload on meetings;
create trigger on_audio_upload
  after update of status on meetings
  for each row
  execute function handle_new_audio_upload();

-- Enable realtime for meetings table
alter publication supabase_realtime add table meetings;

-- Enable RLS for transcription segments
alter table transcription_segments enable row level security;

-- Policies for transcription segments
create policy "Users can view segments of their meetings"
  on transcription_segments for select
  using (
    exists (
      select 1 from meetings
      where meetings.id = transcription_segments.meeting_id
      and meetings.user_id = auth.uid()
    )
  ); 