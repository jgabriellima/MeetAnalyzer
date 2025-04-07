"use client";

import { useEffect, useState, useRef } from "react";
import { TranscriptionSegment, Speaker } from "@/lib/providers/transcription";

interface TranscriptProps {
  meetingId: string;
}

export default function MeetingTranscript({ meetingId }: TranscriptProps) {
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from an API
        const response = await fetch(`/api/meetings/${meetingId}/transcript`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }
        
        const data = await response.json();
        setSegments(data.segments);
        setSpeakers(data.speakers);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        setError("Failed to load transcript");
        
        // For demo purposes, use mock data if API fails
        const mockData = getMockTranscriptData();
        setSegments(mockData.segments);
        setSpeakers(mockData.speakers);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [meetingId]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime * 1000); // Convert to milliseconds
    }
  };

  const seekToSegment = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start / 1000; // Convert from milliseconds to seconds
      if (!isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getSpeakerName = (speakerId?: string) => {
    if (!speakerId) return "Unknown Speaker";
    const speaker = speakers.find(s => s.id === speakerId);
    return speaker?.name || `Speaker ${speakerId}`;
  };

  const getSpeakerColor = (speakerId?: string) => {
    if (!speakerId) return "gray";
    const colors = ["green", "purple", "blue", "orange", "red"];
    const index = speakers.findIndex(s => s.id === speakerId);
    return colors[index % colors.length];
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading transcript...</div>;
  }

  if (error && segments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <audio 
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          className="w-full mb-2"
          src="/api/meetings/audio/sample.mp3"
        />
        <div className="text-sm text-gray-500">
          Click on any segment below to navigate to that point in the recording
        </div>
      </div>

      <div className="space-y-4">
        {segments.map((segment) => {
          const speakerColor = getSpeakerColor(segment.speakerId);
          const isActive = segment.start <= currentTime && segment.end >= currentTime;
          
          return (
            <div 
              key={segment.id}
              className={`p-4 rounded-lg transition-all cursor-pointer ${
                isActive ? 'bg-blue-50 border border-blue-200' : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => seekToSegment(segment.start)}
            >
              <div className="flex items-start mb-2">
                <div className={`text-${speakerColor}-600 font-semibold mr-2`}>
                  {getSpeakerName(segment.speakerId)}
                </div>
                <div className="text-gray-400 text-sm ml-auto">
                  [{formatTime(segment.start)}]
                </div>
              </div>
              <p className="text-gray-800">{segment.text}</p>
              {segment.sentiment && (
                <div className={`mt-1 text-sm text-${
                  segment.sentiment === 'positive' ? 'green' : 
                  segment.sentiment === 'negative' ? 'red' : 'gray'
                }-500`}>
                  Sentiment: {segment.sentiment}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
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
        text: "Agree. I've certainly heard a bit about Lantern, but I'm curious to hear your take. What makes Lantern stand out in such a crowded CRM market?",
        speakerId: "speaker_2",
        sentiment: "neutral",
        confidence: 0.94
      },
      {
        id: "5",
        start: 25500,
        end: 40000,
        text: "Absolutely, Lantern is designed to streamline all your customer relations in one easy-to-use platform. It helps you manage leads and put your customer base on autopilot by continuously managing risk and driving growth. From tracking job changes to accelerating revenue, your next best customer is already using your product. Engage them when they need you the most, with Lantern.",
        speakerId: "speaker_3",
        sentiment: "positive",
        confidence: 0.97
      },
    ],
    speakers: [
      { id: "speaker_1", name: "Dwight Lawson" },
      { id: "speaker_2", name: "Michael Mitchell" },
      { id: "speaker_3", name: "Albert Flores" }
    ]
  };
} 