"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MessageSquare, Reply } from "lucide-react";

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  segmentId: string;
  parentId?: string;
  replies?: Comment[];
}

interface MeetingCommentsProps {
  meetingId: string;
}

export default function MeetingComments({ meetingId }: MeetingCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from an API
        const response = await fetch(`/api/meetings/${meetingId}/comments`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        
        const data = await response.json();
        organizeComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
        
        // For demo purposes, use mock data if API fails
        organizeComments(getMockComments());
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [meetingId]);

  const organizeComments = (commentsData: Comment[]) => {
    // Group comments by parent-child relationships
    const parentComments: Comment[] = [];
    const childComments: {[key: string]: Comment[]} = {};
    
    // First, separate parent and child comments
    commentsData.forEach(comment => {
      if (!comment.parentId) {
        parentComments.push({...comment, replies: []});
      } else {
        if (!childComments[comment.parentId]) {
          childComments[comment.parentId] = [];
        }
        childComments[comment.parentId].push(comment);
      }
    });
    
    // Then add child comments to their parents
    parentComments.forEach(parent => {
      if (childComments[parent.id]) {
        parent.replies = childComments[parent.id];
      }
    });
    
    // Sort by segmentId and then by timestamp
    parentComments.sort((a, b) => {
      if (a.segmentId !== b.segmentId) {
        return a.segmentId.localeCompare(b.segmentId);
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    setComments(parentComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      // In a real implementation, this would send to an API
      const commentData = {
        content: newComment,
        segmentId: activeSegment || "general",
        parentId: replyingTo || undefined,
        meetingId
      };
      
      // Simulate API call
      console.log("Adding comment:", commentData);
      
      // Optimistic update for UI
      const newCommentObj: Comment = {
        id: `temp-${Date.now()}`,
        user: {
          id: "current-user",
          name: "Current User", // In a real app, this would be the logged-in user
        },
        content: newComment,
        timestamp: new Date().toISOString(),
        segmentId: activeSegment || "general",
        parentId: replyingTo || undefined,
      };
      
      if (replyingTo) {
        // Add reply to parent comment
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newCommentObj]
              };
            }
            return comment;
          })
        );
      } else {
        // Add as a new parent comment
        setComments(prevComments => [...prevComments, {...newCommentObj, replies: []}]);
      }
      
      // Reset form
      setNewComment("");
      setReplyingTo(null);
      
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading comments...</div>;
  }

  if (error && comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const groupedComments: { [key: string]: Comment[] } = {};

  // Group comments by segmentId
  comments.forEach(comment => {
    if (!groupedComments[comment.segmentId]) {
      groupedComments[comment.segmentId] = [];
    }
    groupedComments[comment.segmentId].push(comment);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comments</h2>
        <Button variant="outline" size="sm" onClick={() => setActiveSegment(null)}>
          Add general comment
        </Button>
      </div>
      
      {/* New comment form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="mb-2">
          {replyingTo ? (
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>Replying to comment</span>
              <button 
                onClick={cancelReply}
                className="text-blue-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-1">
              {activeSegment 
                ? 'Adding comment to selected segment' 
                : 'Adding general comment about the meeting'
              }
            </div>
          )}
        </div>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          className="mb-2"
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Comment
          </Button>
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-6">
        {Object.keys(groupedComments).length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          Object.entries(groupedComments).map(([segmentId, segmentComments]) => (
            <div key={segmentId} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2">
                <h3 className="font-medium">
                  {segmentId === "general" 
                    ? "General Comments" 
                    : `Comments for Segment ${segmentId}`
                  }
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {segmentComments.map(comment => (
                  <div key={comment.id} className="space-y-3">
                    {/* Parent comment */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 mr-3">
                          {comment.user.avatar && (
                            <img 
                              src={comment.user.avatar} 
                              alt={comment.user.name} 
                              className="rounded-full"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{comment.user.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-1">{comment.content}</div>
                          <div className="mt-2">
                            <button
                              className="text-sm text-blue-500 flex items-center hover:underline"
                              onClick={() => handleReply(comment.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-8 space-y-3">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-start">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-3">
                                {reply.user.avatar && (
                                  <img 
                                    src={reply.user.avatar} 
                                    alt={reply.user.name} 
                                    className="rounded-full"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{reply.user.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <div className="mt-1">{reply.content}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Mock data for demonstration
function getMockComments(): Comment[] {
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