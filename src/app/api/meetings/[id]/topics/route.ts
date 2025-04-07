import { NextRequest, NextResponse } from "next/server";
import { createSSRClient } from "@/lib/supabase/server";

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
    
    // In a real application, we would:
    // 1. Fetch topic analysis data from a database or storage
    // 2. Or perform real-time analysis using NLP services
    // 3. Process and transform the data for visualization
    
    // For now, return mock data
    const mockData = getMockGraphData();
    return NextResponse.json(mockData);
  } catch (error) {
    console.error("Error getting topics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock data for demonstration
function getMockGraphData() {
  return {
    nodes: [
      { id: "1", name: "CRM Platform", group: 1, relevance: 1 },
      { id: "2", name: "Customer Relations", group: 1, relevance: 0.8 },
      { id: "3", name: "Automation", group: 2, relevance: 0.7 },
      { id: "4", name: "Lead Management", group: 3, relevance: 0.6 },
      { id: "5", name: "Revenue Growth", group: 4, relevance: 0.5 },
      { id: "6", name: "Product Features", group: 2, relevance: 0.4 },
      { id: "7", name: "Market Position", group: 3, relevance: 0.3 },
      { id: "8", name: "Onboarding", group: 4, relevance: 0.3 },
      { id: "9", name: "Pricing", group: 5, relevance: 0.2 },
    ],
    links: [
      { source: "1", target: "2", value: 5 },
      { source: "1", target: "3", value: 4 },
      { source: "1", target: "4", value: 3 },
      { source: "2", target: "5", value: 2 },
      { source: "3", target: "6", value: 2 },
      { source: "4", target: "5", value: 1 },
      { source: "1", target: "7", value: 1 },
      { source: "2", target: "8", value: 1 },
      { source: "3", target: "9", value: 1 },
      { source: "5", target: "7", value: 1 },
    ]
  };
} 