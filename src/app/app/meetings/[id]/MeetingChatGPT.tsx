"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, PaperclipIcon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MeetingChatGPTProps {
  meetingId: string;
}

export default function MeetingChatGPT({ meetingId }: MeetingChatGPTProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your meeting assistant. I can help you analyze this meeting, extract key points, or answer any questions you have about the discussion. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API endpoint
      // that processes the message with a language model
      // For demo purposes, we'll simulate a response after a delay
      
      // const response = await fetch(`/api/meetings/${meetingId}/chat`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: inputValue })
      // });
      
      // if (!response.ok) throw new Error("Failed to get AI response");
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add AI response
      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getSimulatedResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add error message
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "assistant"
                  ? "bg-gray-100"
                  : "bg-blue-500 text-white"
              }`}
            >
              <div className="flex items-center mb-2">
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 mr-2" />
                ) : (
                  <User className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">
                  {message.role === "assistant" ? "Assistant" : "You"}
                </span>
                <span className="text-xs ml-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-100">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                <span className="font-medium">Assistant</span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="dot-typing"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask something about this meeting..."
            className="flex-1 min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            className="h-10 w-10 p-2 rounded-full"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
      
      <style jsx>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #6b7280;
          color: #6b7280;
          box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          animation: dot-typing 1.5s infinite linear;
        }

        @keyframes dot-typing {
          0% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          16.667% {
            box-shadow: 9984px -10px 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          33.333% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          50% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px -10px 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          66.667% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
          83.333% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px -10px 0 0 #6b7280;
          }
          100% {
            box-shadow: 9984px 0 0 0 #6b7280, 9999px 0 0 0 #6b7280, 10014px 0 0 0 #6b7280;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to generate simulated responses
function getSimulatedResponse(userMessage: string): string {
  const userMessageLower = userMessage.toLowerCase();
  
  if (userMessageLower.includes("summary") || userMessageLower.includes("summarize")) {
    return "Based on the meeting transcript, here's a summary:\n\n1. David Bromberg introduced Lantern as a comprehensive CRM platform.\n2. The customer showed interest but had questions about how Lantern differentiates itself in the crowded CRM market.\n3. Albert Flores explained that Lantern streamlines customer relations in one platform, highlighting features for managing leads, risk, and driving growth.\n4. The customer seemed particularly interested in the autopilot feature and risk management aspects.\n5. There were some concerns about implementation that might need follow-up.";
  }
  
  if (userMessageLower.includes("key point") || userMessageLower.includes("main point")) {
    return "The key points from this meeting were:\n\n• Lantern positions itself as an all-in-one CRM solution\n• The platform emphasizes automation ('autopilot') as a key differentiator\n• Risk management is highlighted as a particular strength\n• Customer engagement targeting is a focus ('engage them when they need you most')\n• The customer showed interest but had questions about market positioning";
  }
  
  if (userMessageLower.includes("sentiment") || userMessageLower.includes("feelings") || userMessageLower.includes("emotion")) {
    return "The overall sentiment of the meeting was positive. David and Michael started with a friendly exchange. When discussing Lantern, the conversation remained professional with positive undertones. Albert's explanation of Lantern's features was delivered with enthusiasm and confidence. The customer showed genuine interest, though with some skepticism about market differentiation, which is natural in sales conversations.";
  }
  
  if (userMessageLower.includes("action") || userMessageLower.includes("next step")) {
    return "Based on the conversation, here are the recommended next steps:\n\n1. Send detailed implementation documentation to address the customer's concerns\n2. Follow up with specific examples of how Lantern's autopilot feature differentiates from competitors\n3. Prepare a competitive analysis showing Lantern's unique position in the market\n4. Schedule a technical demo focusing on the risk management capabilities\n5. Create a custom ROI calculation based on the customer's specific business metrics";
  }
  
  if (userMessageLower.includes("feature") || userMessageLower.includes("capability")) {
    return "Lantern's key features mentioned in the meeting include:\n\n• Comprehensive CRM platform\n• Customer base management on 'autopilot'\n• Risk management capabilities\n• Growth acceleration tools\n• Job change tracking for customers\n• Revenue acceleration\n• Contextual engagement ('engage them when they need you the most')";
  }
  
  // Default response
  return "I've analyzed the meeting and can help with extracting key points, summarizing content, analyzing sentiment, or suggesting next steps. Would you like me to focus on a specific aspect of the conversation?";
} 