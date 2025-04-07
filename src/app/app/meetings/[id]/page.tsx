import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Play, Pause, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import MeetingOverview from "./MeetingOverview";
import MeetingTranscript from "./MeetingTranscript";
import MeetingComments from "./MeetingComments";
import MeetingChatGPT from "./MeetingChatGPT";
import { Database } from "@/lib/types";

interface MeetingDetailPageProps {
  params: { id: string };
}

// Helper type guard to check if accounts is a valid object with name
function isValidAccount(account: any): account is { name: string | null } {
  return typeof account === 'object' && account !== null && 'name' in account;
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  // Fetch meeting details
  // Explicitly type the expected structure for better type safety
  const { data: meeting, error } = await supabase
    .from("meetings")
    .select(`
      *,
      accounts:account_id ( name )
    `)
    .eq("id", id)
    .single<Database['public']['Tables']['meetings']['Row'] & { accounts: { name: string | null } | null }>();

  if (error || !meeting) {
    console.error("Error fetching meeting:", error);
    notFound();
  }

  // Fetch comments count
  const { count: commentsCount, error: countError } = await supabase
    .from("meeting_comments")
    .select("*", { count: 'exact', head: true }) // Use 'exact' for count
    .eq("meeting_id", id);

  if (countError) {
    console.error("Error fetching comments count:", countError);
    // Handle error appropriately, maybe show 0 comments
  }

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Mock speaking data - in a real app, this would be fetched from the API
  const speakingData = [
    { 
      id: 'speaker_1', 
      name: 'Dwight Lawson', 
      color: 'green',
      totalPercentage: 61,
      segments: [
        { start: 0, end: 10, width: '10%', position: '0%' },
        { start: 30, end: 48, width: '18%', position: '30%' },
        { start: 60, end: 80, width: '20%', position: '60%' },
        { start: 85, end: 90, width: '5%', position: '85%' },
        { start: 93, end: 100, width: '7%', position: '93%' }
      ]
    },
    { 
      id: 'speaker_2', 
      name: 'Michael Mitchell', 
      color: 'blue',
      totalPercentage: 20,
      segments: [
        { start: 12, end: 28, width: '16%', position: '12%' },
        { start: 50, end: 54, width: '4%', position: '50%' }
      ]
    },
    { 
      id: 'speaker_3', 
      name: 'Albert Flores', 
      color: 'purple',
      totalPercentage: 13,
      segments: [
        { start: 80, end: 84, width: '4%', position: '80%' },
        { start: 90, end: 93, width: '3%', position: '90%' },
        { start: 55, end: 59, width: '4%', position: '55%' }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center mb-4">
        <Link href="/app/meetings" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{meeting.title || "Untitled Meeting"}</h1>
          <p className="text-sm text-gray-500">
            {meeting.description && <span>{meeting.description}</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Caller</div>
          <div className="font-medium">{user.user_metadata?.full_name || user.email}</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Duration</div>
          <div className="font-medium">{meeting.duration ? `${meeting.duration} min` : "Unknown"}</div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Date</div>
          <div className="font-medium">
            {/* Check if created_at is not null before creating Date */}
            {meeting.created_at ? new Date(meeting.created_at).toLocaleDateString() : "Unknown"}
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Account</div>
          <div className="font-medium">
            {/* Use type guard for safer access */}
            {isValidAccount(meeting.accounts) ? (meeting.accounts.name || "Unnamed Account") : "No account"}
          </div>
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Column - Player and Speaker Timeline */}
        <div className="md:w-1/3 space-y-4">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Video/Audio player placeholder */}
            <div className="aspect-video bg-black flex items-center justify-center text-white">
              {meeting.recording_url ? (
                <video 
                  src={meeting.recording_url}
                  className="w-full h-full object-contain"
                  controls
                  poster="/placeholder-video.jpg"
                />
              ) : (
                <div className="text-center p-8">
                  <Volume2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Audio Recording</p>
                </div>
              )}
            </div>
            
            {/* Audio Controls */}
            <div className="p-3 flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-white rounded-full h-10 w-10">
                <Play className="h-5 w-5" />
              </Button>
              <div className="h-1 bg-gray-600 flex-1 rounded-full">
                <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-300">15:34 / 38:34</span>
            </div>
          </div>
          
          {/* Speaker Timeline - Updated to show full timeline with speaking blocks */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold mb-3">Participants</h3>
            
            {speakingData.map((speaker) => (
              <div key={speaker.id} className="mb-4">
                <div className="flex items-center mb-1">
                  <div className={`w-8 h-8 rounded-full bg-${speaker.color}-100 flex items-center justify-center text-${speaker.color}-700 font-bold text-sm`}>
                    {getInitials(speaker.name)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">{speaker.name}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">{speaker.totalPercentage}%</div>
                </div>
                
                {/* Timeline visualization */}
                <div className="h-5 bg-gray-100 rounded-md w-full relative my-1">
                  {speaker.segments.map((segment, index) => (
                    <div 
                      key={`${speaker.id}-segment-${index}`}
                      className={`absolute h-full bg-${speaker.color}-500 rounded-md`}
                      style={{ 
                        width: segment.width, 
                        left: segment.position,
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Time markers - only shown for the last speaker */}
                {speaker.id === speakingData[speakingData.length - 1].id && (
                  <div className="w-full flex justify-between text-xs text-gray-400 mt-1">
                    <span>0:00</span>
                    <span>9:35</span>
                    <span>19:10</span>
                    <span>28:45</span>
                    <span>38:20</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add dark vertical line to represent current playback position */}
            {/* (would be synchronized with actual playback in a real implementation) */}
            <div className="relative mt-4 pt-2">
              <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gray-800 rounded z-10">
                <div className="w-2 h-2 rounded-full bg-gray-800 -ml-[3px] -mt-1"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Tabs */}
        <div className="md:w-2/3">
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="comments">
                Comments {commentsCount ? `(${commentsCount})` : ""}
              </TabsTrigger>
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
            </TabsList>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search transcript"
                    className="pl-10"
                  />
                </div>
              </div>

              <TabsContent value="overview" className="mt-0">
                <MeetingOverview meetingId={id} />
              </TabsContent>

              <TabsContent value="transcript" className="mt-0">
                <MeetingTranscript meetingId={id} />
              </TabsContent>

              <TabsContent value="comments" className="mt-0">
                <MeetingComments meetingId={id} />
              </TabsContent>

              <TabsContent value="chatgpt" className="mt-0">
                <MeetingChatGPT meetingId={id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}