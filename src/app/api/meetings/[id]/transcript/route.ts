import { NextRequest, NextResponse } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";
import { TranscriptionFeature } from "@/lib/providers/transcription";
import { TranscriptionProviderFactory } from "@/lib/providers/transcription/provider-factory";
import { defaultTranscriptionConfig } from "@/lib/providers/transcription";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSSRClient();
    const { id } = await params;
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get meeting data
    const { data: meeting, error: meetingError } = await supabase
      .from("meetings")
      .select("*")
      .eq("id", id)
      .single();
    
    if (meetingError || !meeting) {
      console.error("Meeting not found error:", meetingError);
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }
    
    // Check if user has access to this meeting
    if (meeting.user_id !== user.id) {
      // In a real app, you might also check for team/organization access
      return NextResponse.json(
        { error: "You don't have access to this meeting" },
        { status: 403 }
      );
    }
    
    // Get transcription data
    // In a real app, we would fetch this from the database
    // or request it from the transcription provider
    
    // Example of how to use a provider:
    // const factory = new TranscriptionProviderFactory(defaultTranscriptionConfig);
    // const provider = factory.getProviderWithFeatures([TranscriptionFeature.TRANSCRIPTION]);
    // const result = await provider.getTranscription(meeting.transcription_id);
    
    // For now, return mock data
    const mockData = getMockTranscriptData();
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error getting transcript:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock data for demonstration
function getMockTranscriptData() {
  return {
    segments: [
      {
        id: "1",
        start: 0,
        end: 4500,
        text: "Hi there! This is David Bromberg I'm the founder of Lantern. How are you doing today?",
        speakerId: "speaker_1",
        sentiment: "positive",
        confidence: 0.95
      },
      {
        id: "2",
        start: 4800,
        end: 8000,
        text: "Hi David! I'm doing well, thank you. How's the business world treating you these days?",
        speakerId: "speaker_2",
        sentiment: "positive",
        confidence: 0.92
      },
      {
        id: "3",
        start: 8200,
        end: 15000,
        text: "It's a busy world out there! That's why I'm here to talk about Lantern, our comprehensive CRM platform. Have you heard about Lantern before?",
        speakerId: "speaker_1",
        sentiment: "neutral",
        confidence: 0.89
      },
      {
        id: "4",
        start: 15300,
        end: 25000,
        text: "I've certainly heard a bit about Lantern, but I'm curious to hear your take. What makes Lantern stand out in such a crowded CRM market?",
        speakerId: "speaker_2",
        sentiment: "neutral",
        confidence: 0.94
      },
      {
        id: "5",
        start: 25500,
        end: 40000,
        text: "Absolutely, Lantern is designed to streamline all your customer relations in one easy-to-use platform. It helps you manage leads and put your customer base on autopilot by continuously managing risk and driving growth. From tracking job changes to accelerating revenue, your next best customer is already using your product.",
        speakerId: "speaker_3",
        sentiment: "positive",
        confidence: 0.97
      },
      {
        id: "6",
        start: 40500,
        end: 50000,
        text: "That sounds interesting. Can you tell me more about the pricing model? We have a team of about 50 people who would potentially use this system.",
        speakerId: "speaker_2",
        sentiment: "neutral",
        confidence: 0.91
      },
      {
        id: "7",
        start: 50500,
        end: 65000,
        text: "Of course! Our pricing is very competitive. For a team of 50, we recommend our Business plan which is $45 per user per month, billed annually. This includes all our core features, API access, and premium support. Would you like me to arrange a live demo for your team?",
        speakerId: "speaker_1",
        sentiment: "positive",
        confidence: 0.93
      },
    ],
    speakers: [
      { id: "speaker_1", name: "Dwight Lawson" },
      { id: "speaker_2", name: "Michael Mitchell" },
      { id: "speaker_3", name: "Albert Flores" }
    ]
  };
} 