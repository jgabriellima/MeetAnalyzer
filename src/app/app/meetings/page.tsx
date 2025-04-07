import { redirect } from "next/navigation";
import { createSSRClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Database } from "@/lib/types";

type Meeting = Database['public']['Tables']['meetings']['Row'];

export default async function MeetingsPage() {
  const supabase = await createSSRClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch meetings from Supabase
  const { data: meetings, error } = await supabase
    .from("meetings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching meetings:", error);
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meetings</h1>
        <Link href="/app/meetings/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting: Meeting) => (
            <Link
              key={meeting.id}
              href={`/app/meetings/${meeting.id}`}
              className="block"
            >
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <h3 className="text-xl font-semibold mb-2 truncate">
                  {meeting.title || "Untitled Meeting"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(meeting.created_at).toLocaleDateString()} • 
                  {meeting.duration ? ` ${meeting.duration} min` : " Unknown duration"}
                </p>
                <div className="flex items-center mt-2">
                  <div className="text-sm text-gray-600">
                    {meeting.participants_count || 0} participants
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No meetings yet</h2>
          <p className="text-gray-600 mb-8">
            Get started by creating your first meeting or uploading a recording
          </p>
          <Link href="/app/meetings/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create meeting
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 