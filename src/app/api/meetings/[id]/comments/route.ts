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
    
    // In a real application, we would fetch comments from the database
    // For now, return mock data
    return NextResponse.json(getMockComments());
  } catch (error) {
    console.error("Error getting comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSSRClient();
    
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
      .eq("id", params.id)
      .single();
    
    if (meetingError || !meeting) {
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
    
    // Get request body
    const { content, segmentId, parentId } = await request.json();
    
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }
    
    // In a real application, we would insert the comment into the database
    // For example:
    // const { data: comment, error: commentError } = await supabase
    //   .from("meeting_comments")
    //   .insert({
    //     meeting_id: params.id,
    //     user_id: user.id,
    //     content,
    //     segment_id: segmentId || "general",
    //     parent_id: parentId || null,
    //   })
    //   .select()
    //   .single();
    
    // if (commentError) {
    //   throw commentError;
    // }
    
    // For now, return a mock response
    const mockComment = {
      id: `comment-${Date.now()}`,
      user: {
        id: user.id,
        name: user.user_metadata?.full_name || user.email,
        avatar: user.user_metadata?.avatar_url,
      },
      content,
      timestamp: new Date().toISOString(),
      segmentId: segmentId || "general",
      parentId: parentId || undefined,
    };
    
    return NextResponse.json(mockComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock data for demonstration
function getMockComments() {
  return [
    {
      id: "1",
      user: {
        id: "user1",
        name: "Jane Cooper",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg"
      },
      content: "Great explanation of the value proposition. I think the part about risk management resonates well with current market needs.",
      timestamp: "2023-03-15T10:30:00Z",
      segmentId: "5"
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Robert Johnson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      content: "I think we should emphasize the autopilot feature more in our next call. It seems like a key differentiator.",
      timestamp: "2023-03-15T11:15:00Z",
      segmentId: "5"
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "Sarah Miller",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg"
      },
      content: "The customer seemed interested but concerned about implementation. We should prepare more details on that for follow-up.",
      timestamp: "2023-03-15T12:00:00Z",
      segmentId: "general"
    },
    {
      id: "4",
      user: {
        id: "user1",
        name: "Jane Cooper",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg"
      },
      content: "Good point, Sarah. I'll prepare an implementation timeline to send over.",
      timestamp: "2023-03-15T12:30:00Z",
      segmentId: "general",
      parentId: "3"
    },
    {
      id: "5",
      user: {
        id: "user4",
        name: "Mark Davis",
        avatar: "https://randomuser.me/api/portraits/men/91.jpg"
      },
      content: "The initial question about market positioning was well handled. Let's make sure we have more competitive analysis ready for next time.",
      timestamp: "2023-03-15T13:45:00Z",
      segmentId: "4"
    }
  ];
} 