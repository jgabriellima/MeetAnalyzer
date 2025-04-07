import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
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

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <div className="flex items-center mb-2">
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

        <div className="mb-4">
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