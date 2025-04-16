export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          id: string
          stripe_subscription_id: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          duration: number | null
          error_message: string | null
          id: string
          main_topics: string[] | null
          status: string | null
          title: string
          total_speakers: number | null
          transcription_id: string | null
          transcription_status:
            | Database["public"]["Enums"]["transcription_status"]
            | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          error_message?: string | null
          id?: string
          main_topics?: string[] | null
          status?: string | null
          title: string
          total_speakers?: number | null
          transcription_id?: string | null
          transcription_status?:
            | Database["public"]["Enums"]["transcription_status"]
            | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          error_message?: string | null
          id?: string
          main_topics?: string[] | null
          status?: string | null
          title?: string
          total_speakers?: number | null
          transcription_id?: string | null
          transcription_status?:
            | Database["public"]["Enums"]["transcription_status"]
            | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      transcription_action_items: {
        Row: {
          assignee: string | null
          confidence: number
          created_at: string
          due_date: string | null
          id: string
          meeting_id: string | null
          segment_id: string | null
          status: string
          text: string
        }
        Insert: {
          assignee?: string | null
          confidence: number
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          segment_id?: string | null
          status?: string
          text: string
        }
        Update: {
          assignee?: string | null
          confidence?: number
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          segment_id?: string | null
          status?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcription_action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
          {
            foreignKeyName: "transcription_action_items_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      transcription_interactions: {
        Row: {
          confidence: number
          created_at: string
          end_time: number
          id: string
          interaction_type: string
          meeting_id: string | null
          sentiment: string | null
          speaker_from: string
          speaker_to: string
          start_time: number
        }
        Insert: {
          confidence: number
          created_at?: string
          end_time: number
          id?: string
          interaction_type: string
          meeting_id?: string | null
          sentiment?: string | null
          speaker_from: string
          speaker_to: string
          start_time: number
        }
        Update: {
          confidence?: number
          created_at?: string
          end_time?: number
          id?: string
          interaction_type?: string
          meeting_id?: string | null
          sentiment?: string | null
          speaker_from?: string
          speaker_to?: string
          start_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "transcription_interactions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_interactions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      transcription_questions: {
        Row: {
          answer_segment_id: string | null
          answered_by: string | null
          asked_by: string
          confidence: number
          created_at: string
          id: string
          is_answered: boolean
          meeting_id: string | null
          question_text: string
          segment_id: string | null
        }
        Insert: {
          answer_segment_id?: string | null
          answered_by?: string | null
          asked_by: string
          confidence: number
          created_at?: string
          id?: string
          is_answered?: boolean
          meeting_id?: string | null
          question_text: string
          segment_id?: string | null
        }
        Update: {
          answer_segment_id?: string | null
          answered_by?: string | null
          asked_by?: string
          confidence?: number
          created_at?: string
          id?: string
          is_answered?: boolean
          meeting_id?: string | null
          question_text?: string
          segment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_questions_answer_segment_id_fkey"
            columns: ["answer_segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_questions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_questions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
          {
            foreignKeyName: "transcription_questions_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      transcription_search_index: {
        Row: {
          created_at: string
          end_time: number
          id: string
          meeting_id: string | null
          metadata: Json
          segment_id: string | null
          speaker: string | null
          start_time: number
          text: string
          text_vector: string | null
          word_id: string | null
        }
        Insert: {
          created_at?: string
          end_time: number
          id?: string
          meeting_id?: string | null
          metadata?: Json
          segment_id?: string | null
          speaker?: string | null
          start_time: number
          text: string
          text_vector?: string | null
          word_id?: string | null
        }
        Update: {
          created_at?: string
          end_time?: number
          id?: string
          meeting_id?: string | null
          metadata?: Json
          segment_id?: string | null
          speaker?: string | null
          start_time?: number
          text?: string
          text_vector?: string | null
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_search_index_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_search_index_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
          {
            foreignKeyName: "transcription_search_index_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_search_index_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "transcription_words"
            referencedColumns: ["id"]
          },
        ]
      }
      transcription_segments: {
        Row: {
          confidence: number
          created_at: string
          end_time: number
          id: string
          is_action_item: boolean | null
          is_question: boolean | null
          meeting_id: string | null
          sentiment_score: number | null
          speaker: string | null
          speaker_sequence: number | null
          start_time: number
          text: string
          text_vector: string | null
        }
        Insert: {
          confidence: number
          created_at?: string
          end_time: number
          id?: string
          is_action_item?: boolean | null
          is_question?: boolean | null
          meeting_id?: string | null
          sentiment_score?: number | null
          speaker?: string | null
          speaker_sequence?: number | null
          start_time: number
          text: string
          text_vector?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          end_time?: number
          id?: string
          is_action_item?: boolean | null
          is_question?: boolean | null
          meeting_id?: string | null
          sentiment_score?: number | null
          speaker?: string | null
          speaker_sequence?: number | null
          start_time?: number
          text?: string
          text_vector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      transcription_speakers: {
        Row: {
          average_confidence: number
          created_at: string
          id: string
          interaction_matrix: Json | null
          interruption_count: number
          meeting_id: string | null
          question_count: number
          segments_count: number
          sentiment_distribution: Json
          speaker: string
          top_topics: string[] | null
          total_time: number
          words_count: number
        }
        Insert: {
          average_confidence?: number
          created_at?: string
          id?: string
          interaction_matrix?: Json | null
          interruption_count?: number
          meeting_id?: string | null
          question_count?: number
          segments_count?: number
          sentiment_distribution?: Json
          speaker: string
          top_topics?: string[] | null
          total_time?: number
          words_count?: number
        }
        Update: {
          average_confidence?: number
          created_at?: string
          id?: string
          interaction_matrix?: Json | null
          interruption_count?: number
          meeting_id?: string | null
          question_count?: number
          segments_count?: number
          sentiment_distribution?: Json
          speaker?: string
          top_topics?: string[] | null
          total_time?: number
          words_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "transcription_speakers_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_speakers_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      transcription_topic_segments: {
        Row: {
          created_at: string
          id: string
          meeting_id: string | null
          relevance_score: number
          segment_id: string | null
          topic_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id?: string | null
          relevance_score: number
          segment_id?: string | null
          topic_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string | null
          relevance_score?: number
          segment_id?: string | null
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_topic_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_topic_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
          {
            foreignKeyName: "transcription_topic_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_topic_segments_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "transcription_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      transcription_topics: {
        Row: {
          confidence: number
          created_at: string
          first_mention_time: number
          id: string
          last_mention_time: number
          meeting_id: string | null
          mention_count: number
          related_topics: string[] | null
          sentiment_distribution: Json
          speakers: string[] | null
          topic: string
        }
        Insert: {
          confidence: number
          created_at?: string
          first_mention_time: number
          id?: string
          last_mention_time: number
          meeting_id?: string | null
          mention_count?: number
          related_topics?: string[] | null
          sentiment_distribution?: Json
          speakers?: string[] | null
          topic: string
        }
        Update: {
          confidence?: number
          created_at?: string
          first_mention_time?: number
          id?: string
          last_mention_time?: number
          meeting_id?: string | null
          mention_count?: number
          related_topics?: string[] | null
          sentiment_distribution?: Json
          speakers?: string[] | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcription_topics_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_topics_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      transcription_words: {
        Row: {
          confidence: number
          created_at: string
          end_time: number
          id: string
          meeting_id: string | null
          segment_id: string | null
          speaker: string | null
          start_time: number
          text: string
          text_vector: string | null
        }
        Insert: {
          confidence: number
          created_at?: string
          end_time: number
          id?: string
          meeting_id?: string | null
          segment_id?: string | null
          speaker?: string | null
          start_time: number
          text: string
          text_vector?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          end_time?: number
          id?: string
          meeting_id?: string | null
          segment_id?: string | null
          speaker?: string | null
          start_time?: number
          text?: string
          text_vector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_words_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_words_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
          {
            foreignKeyName: "transcription_words_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "transcription_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      usage: {
        Row: {
          count: number | null
          created_at: string
          feature: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          feature: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string
          feature?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_meeting_summary: {
        Row: {
          duration: number | null
          main_topics: string[] | null
          meeting_id: string | null
          speaker_stats: Json | null
          title: string | null
          total_action_items: number | null
          total_questions: number | null
          total_speakers: number | null
          total_topics: number | null
        }
        Relationships: []
      }
      mv_speaker_timeline: {
        Row: {
          avg_sentiment: number | null
          meeting_id: string | null
          minute: number | null
          segments_count: number | null
          speaker: string | null
          speaking_time: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_segments_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      mv_topic_summary: {
        Row: {
          avg_sentiment: number | null
          meeting_id: string | null
          segments_count: number | null
          speakers: string[] | null
          speakers_count: number | null
          topic: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcription_topics_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcription_topics_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "mv_meeting_summary"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": unknown } | { "": string }
        Returns: unknown
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": unknown } | { "": unknown } | { "": string }
        Returns: unknown
      }
      refresh_transcription_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": unknown } | { "": string }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      transcription_status: "uploaded" | "processing" | "completed" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; name: string; owner: string; metadata: Json }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_legacy_v1: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v1_optimised: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
      search_v2: {
        Args: {
          prefix: string
          bucket_name: string
          limits?: number
          levels?: number
          start_after?: string
        }
        Returns: {
          key: string
          name: string
          id: string
          updated_at: string
          created_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      transcription_status: ["uploaded", "processing", "completed", "error"],
    },
  },
  storage: {
    Enums: {},
  },
} as const

