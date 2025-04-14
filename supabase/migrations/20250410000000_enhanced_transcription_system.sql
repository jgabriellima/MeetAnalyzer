-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Update meetings table
ALTER TABLE meetings
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS total_speakers integer,
ADD COLUMN IF NOT EXISTS main_topics text[];

-- Drop existing transcription tables to rebuild with new schema
DROP TABLE IF EXISTS transcription_metadata CASCADE;
DROP TABLE IF EXISTS transcription_segments CASCADE;
DROP TABLE IF EXISTS transcription_speakers CASCADE;

-- Create enhanced transcription tables
CREATE TABLE transcription_segments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    start_time integer NOT NULL,
    end_time integer NOT NULL,
    text text NOT NULL,
    speaker text,
    confidence float NOT NULL,
    text_vector vector(1536), -- Dimensionality matches common embedding models
    sentiment_score float,
    is_question boolean DEFAULT false,
    is_action_item boolean DEFAULT false,
    speaker_sequence integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT valid_sentiment CHECK (sentiment_score >= -1 AND sentiment_score <= 1)
);

CREATE TABLE transcription_words (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    segment_id uuid REFERENCES transcription_segments(id) ON DELETE CASCADE,
    text text NOT NULL,
    start_time integer NOT NULL,
    end_time integer NOT NULL,
    confidence float NOT NULL,
    speaker text,
    text_vector vector(1536),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE TABLE transcription_speakers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    speaker text NOT NULL,
    total_time integer NOT NULL DEFAULT 0,
    segments_count integer NOT NULL DEFAULT 0,
    words_count integer NOT NULL DEFAULT 0,
    average_confidence float NOT NULL DEFAULT 0,
    interruption_count integer NOT NULL DEFAULT 0,
    question_count integer NOT NULL DEFAULT 0,
    sentiment_distribution jsonb NOT NULL DEFAULT '{"positive": 0, "negative": 0, "neutral": 0}'::jsonb,
    top_topics text[] DEFAULT ARRAY[]::text[],
    interaction_matrix jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(meeting_id, speaker)
);

CREATE TABLE transcription_interactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    speaker_from text NOT NULL,
    speaker_to text NOT NULL,
    start_time integer NOT NULL,
    end_time integer NOT NULL,
    interaction_type text NOT NULL,
    sentiment text,
    confidence float NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT valid_interaction_type CHECK (interaction_type IN ('reply', 'interruption', 'question', 'agreement', 'disagreement')),
    CONSTRAINT valid_sentiment CHECK (sentiment IN ('POSITIVE', 'NEGATIVE', 'NEUTRAL'))
);

CREATE TABLE transcription_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    topic text NOT NULL,
    confidence float NOT NULL,
    first_mention_time integer NOT NULL,
    last_mention_time integer NOT NULL,
    mention_count integer NOT NULL DEFAULT 1,
    speakers text[] DEFAULT ARRAY[]::text[],
    related_topics text[] DEFAULT ARRAY[]::text[],
    sentiment_distribution jsonb NOT NULL DEFAULT '{"positive": 0, "negative": 0, "neutral": 0}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT valid_mention_range CHECK (last_mention_time >= first_mention_time),
    UNIQUE(meeting_id, topic)
);

CREATE TABLE transcription_topic_segments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    topic_id uuid REFERENCES transcription_topics(id) ON DELETE CASCADE,
    segment_id uuid REFERENCES transcription_segments(id) ON DELETE CASCADE,
    relevance_score float NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_relevance CHECK (relevance_score >= 0 AND relevance_score <= 1),
    UNIQUE(topic_id, segment_id)
);

CREATE TABLE transcription_action_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    segment_id uuid REFERENCES transcription_segments(id) ON DELETE CASCADE,
    text text NOT NULL,
    assignee text,
    due_date timestamp with time zone,
    status text NOT NULL DEFAULT 'pending',
    confidence float NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'completed'))
);

CREATE TABLE transcription_questions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    segment_id uuid REFERENCES transcription_segments(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    answer_segment_id uuid REFERENCES transcription_segments(id) ON DELETE SET NULL,
    asked_by text NOT NULL,
    answered_by text,
    is_answered boolean NOT NULL DEFAULT false,
    confidence float NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

CREATE TABLE transcription_search_index (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id uuid REFERENCES meetings(id) ON DELETE CASCADE,
    segment_id uuid REFERENCES transcription_segments(id) ON DELETE CASCADE,
    word_id uuid REFERENCES transcription_words(id) ON DELETE CASCADE,
    text text NOT NULL,
    text_vector vector(1536),
    start_time integer NOT NULL,
    end_time integer NOT NULL,
    speaker text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX idx_segments_text_vector ON transcription_segments USING ivfflat (text_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_words_text_vector ON transcription_words USING ivfflat (text_vector vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_search_text_vector ON transcription_search_index USING ivfflat (text_vector vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_segments_meeting_time ON transcription_segments(meeting_id, start_time, end_time);
CREATE INDEX idx_segments_speaker ON transcription_segments(meeting_id, speaker);
CREATE INDEX idx_segments_text_trigram ON transcription_segments USING gin (text gin_trgm_ops);

CREATE INDEX idx_topic_segments_relevance ON transcription_topic_segments(meeting_id, topic_id, relevance_score);
CREATE INDEX idx_topics_mentions ON transcription_topics(meeting_id, mention_count DESC);

CREATE INDEX idx_interactions_speakers ON transcription_interactions(meeting_id, speaker_from, speaker_to);
CREATE INDEX idx_speakers_stats ON transcription_speakers(meeting_id, total_time DESC);

-- Create materialized views for common analytics
CREATE MATERIALIZED VIEW mv_speaker_timeline AS
SELECT 
    meeting_id,
    speaker,
    FLOOR(start_time/60) * 60 as minute,
    COUNT(*) as segments_count,
    SUM(end_time - start_time) as speaking_time,
    AVG(sentiment_score) as avg_sentiment
FROM transcription_segments
GROUP BY meeting_id, speaker, FLOOR(start_time/60) * 60;

CREATE UNIQUE INDEX idx_speaker_timeline ON mv_speaker_timeline (meeting_id, speaker, minute);

CREATE MATERIALIZED VIEW mv_topic_summary AS
SELECT 
    t.meeting_id,
    t.topic,
    COUNT(DISTINCT ts.segment_id) as segments_count,
    COUNT(DISTINCT s.speaker) as speakers_count,
    AVG(s.sentiment_score) as avg_sentiment,
    array_agg(DISTINCT s.speaker) as speakers
FROM transcription_topics t
JOIN transcription_topic_segments ts ON t.id = ts.topic_id
JOIN transcription_segments s ON ts.segment_id = s.id
GROUP BY t.meeting_id, t.topic;

CREATE UNIQUE INDEX idx_topic_summary ON mv_topic_summary (meeting_id, topic);

-- Add RLS policies
ALTER TABLE transcription_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_topic_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcription_search_index ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transcription data"
ON transcription_segments FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

-- Add additional indexes for common queries
CREATE INDEX idx_segments_action_items ON transcription_segments(meeting_id) WHERE is_action_item = true;
CREATE INDEX idx_segments_questions ON transcription_segments(meeting_id) WHERE is_question = true;
CREATE INDEX idx_action_items_status ON transcription_action_items(meeting_id, status);
CREATE INDEX idx_questions_answered ON transcription_questions(meeting_id, is_answered);
CREATE INDEX idx_search_text_trigram ON transcription_search_index USING gin (text gin_trgm_ops);

-- Add RLS policies for all tables
CREATE POLICY "Users can view their own transcription words"
ON transcription_words FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription speakers"
ON transcription_speakers FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription interactions"
ON transcription_interactions FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription topics"
ON transcription_topics FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription topic segments"
ON transcription_topic_segments FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription action items"
ON transcription_action_items FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own action items"
ON transcription_action_items FOR UPDATE
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own transcription questions"
ON transcription_questions FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own questions"
ON transcription_questions FOR UPDATE
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own search index"
ON transcription_search_index FOR SELECT
TO authenticated
USING (
    meeting_id IN (
        SELECT id FROM meetings WHERE user_id = auth.uid()
    )
);

-- Add insert policies for service role
CREATE POLICY "Service role can insert transcription data"
ON transcription_segments FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert word data"
ON transcription_words FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert speaker data"
ON transcription_speakers FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert interaction data"
ON transcription_interactions FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert topic data"
ON transcription_topics FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert topic segment data"
ON transcription_topic_segments FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert action item data"
ON transcription_action_items FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert question data"
ON transcription_questions FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert search index data"
ON transcription_search_index FOR INSERT
TO service_role
WITH CHECK (true);

-- Create additional materialized views for common analytics
CREATE MATERIALIZED VIEW mv_meeting_summary AS
WITH speaker_stats AS (
    SELECT 
        meeting_id,
        speaker,
        SUM(end_time - start_time) as total_time,
        COUNT(*) as segments,
        AVG(sentiment_score) as avg_sentiment
    FROM transcription_segments
    GROUP BY meeting_id, speaker
)
SELECT 
    m.id as meeting_id,
    m.title,
    m.duration,
    COUNT(DISTINCT s.speaker) as total_speakers,
    COUNT(DISTINCT t.topic) as total_topics,
    COUNT(DISTINCT CASE WHEN s.is_question THEN s.id END) as total_questions,
    COUNT(DISTINCT CASE WHEN s.is_action_item THEN s.id END) as total_action_items,
    array_agg(DISTINCT t.topic) FILTER (WHERE t.topic IS NOT NULL) as main_topics,
    jsonb_object_agg(
        ss.speaker,
        jsonb_build_object(
            'total_time', ss.total_time,
            'segments', ss.segments,
            'avg_sentiment', ss.avg_sentiment
        )
    ) as speaker_stats
FROM meetings m
LEFT JOIN transcription_segments s ON m.id = s.meeting_id
LEFT JOIN transcription_topics t ON m.id = t.meeting_id
LEFT JOIN speaker_stats ss ON m.id = ss.meeting_id
GROUP BY m.id, m.title, m.duration;

CREATE UNIQUE INDEX idx_meeting_summary ON mv_meeting_summary (meeting_id);

-- Update refresh function to include new view
CREATE OR REPLACE FUNCTION refresh_transcription_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_speaker_timeline;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_topic_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_meeting_summary;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update meeting stats
CREATE OR REPLACE FUNCTION update_meeting_stats()
RETURNS trigger AS $$
BEGIN
    UPDATE meetings
    SET 
        total_speakers = (SELECT COUNT(DISTINCT speaker) FROM transcription_segments WHERE meeting_id = NEW.meeting_id),
        main_topics = (SELECT array_agg(topic ORDER BY mention_count DESC) FROM transcription_topics WHERE meeting_id = NEW.meeting_id LIMIT 5)
    WHERE id = NEW.meeting_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meeting_stats_on_segment
AFTER INSERT ON transcription_segments
FOR EACH ROW
EXECUTE FUNCTION update_meeting_stats();

CREATE TRIGGER update_meeting_stats_on_topic
AFTER INSERT ON transcription_topics
FOR EACH ROW
EXECUTE FUNCTION update_meeting_stats(); 