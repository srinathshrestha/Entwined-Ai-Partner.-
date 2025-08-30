"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Check, X, Users, Bot } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MinimalChatInput from "@/components/chat/MinimalChatInput";
import MessageActionsV2 from "@/components/chat/MessageActionsV2";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { SimplifiedMemory } from "@/types";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  parentId?: string;
}

interface CompanionInfo {
  name: string;
  id: string;
  affectionLevel: number;
  empathyLevel: number;
  curiosityLevel: number;
  playfulness: number;
  humorStyle: string;
  communicationStyle: string;
  avatarUrl?: string;
}

export default function SimplifiedChatPageV2() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Use the new onboarding check hook
  const { onboardingStatus, isChecking, needsOnboarding } =
    useOnboardingCheck();

  // States
  const [companion, setCompanion] = useState<CompanionInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Message interaction states
  const [replyToMessage, setReplyToMessage] = useState<{
    id: string;
    content: string;
    role: "user" | "assistant";
  } | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check onboarding status and redirect if needed
  useEffect(() => {
    if (!isChecking && session?.user && needsOnboarding) {
      console.log("❌ User needs onboarding, redirecting...");
      router.replace("/onboarding/simplified");
    }
  }, [isChecking, needsOnboarding, session?.user, router]);

  // Load companion and conversation history
  useEffect(() => {
    const loadCompanionAndHistory = async () => {
      try {
        setIsLoadingHistory(true);

        // Load companion info
        const companionResponse = await fetch("/api/personality");
        if (companionResponse.ok) {
          const companionData = await companionResponse.json();
          setCompanion(companionData.companion);
        }

        // Load conversation history
        const historyResponse = await fetch("/api/chat/simplified");
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setMessages(historyData.messages || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load conversation history");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (session?.user && !isChecking && !needsOnboarding) {
      loadCompanionAndHistory();
    }
  }, [session?.user, isChecking, needsOnboarding]);

  const handleSendMessage = async (
    message: string,
    selectedMemories: SimplifiedMemory[],
    replyToMessageId?: string
  ) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
      parentId: replyToMessageId,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear reply state
    setReplyToMessage(null);

    try {
      const response = await fetch("/api/chat/simplified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          selectedMemories,
          replyToMessageId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Handle JSON response (not streaming)
      const responseData = await response.json();

      // Update the user message with the real ID from backend
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? {
                ...msg,
                id: responseData.userMessage.id,
                createdAt: responseData.userMessage.createdAt,
              }
            : msg
        )
      );

      // Add the AI message with the real data from backend
      const aiMessage: ChatMessage = {
        id: responseData.aiMessage.id,
        role: "assistant",
        content: responseData.aiMessage.content,
        createdAt: responseData.aiMessage.createdAt,
        parentId: replyToMessageId,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");

      // Remove the user message that failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleReplyToMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setReplyToMessage({
        id: message.id,
        content: message.content,
        role: message.role,
      });
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message && message.role === "user") {
      setEditingMessage(messageId);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !editContent.trim()) return;

    try {
      // Update message locally
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessage
            ? { ...msg, content: editContent.trim() }
            : msg
        )
      );

      // You would typically call an API to update the message in the database
      // await fetch(`/api/chat/messages/${editingMessage}`, {
      //   method: "PUT",
      //   body: JSON.stringify({ content: editContent.trim() }),
      // });

      setEditingMessage(null);
      setEditContent("");
      toast.success("Message updated");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Call API to delete message first
      const response = await fetch(
        `/api/chat/messages?messageId=${messageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Only remove from local state if API call was successful
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(
        `Failed to delete message: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Loading states
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Loading states
  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {status === "loading"
              ? "Loading your session..."
              : "Checking your progress..."}
          </p>
        </div>
      </div>
    );
  }

  // If user needs onboarding, show loading while redirecting
  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={companion?.avatarUrl || "/placeholder-avatar.png"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {companion?.name?.charAt(0) || "AI"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">
                  {companion?.name || "Your Companion"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Online & Ready to Chat
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/settings")}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => {
              const isUser = message.role === "user";
              const isEditing = editingMessage === message.id;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 flex ${
                    isUser ? "justify-end" : "justify-start"
                  } group`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {isUser ? (
                        <AvatarImage
                          src={session.user.image || "/placeholder-avatar.png"}
                        />
                      ) : (
                        <AvatarImage
                          src={
                            companion?.avatarUrl || "/placeholder-avatar.png"
                          }
                        />
                      )}
                      <AvatarFallback
                        className={
                          isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }
                      >
                        {isUser ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <Card
                      className={`${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      } shadow-sm`}
                    >
                      <CardContent className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[60px] resize-none bg-background text-foreground"
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                disabled={!editContent.trim()}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* WhatsApp-style Reply Context */}
                            {message.parentId && (
                              <div className="mb-3">
                                {(() => {
                                  const replyToMsg = messages.find(
                                    (m) => m.id === message.parentId
                                  );
                                  if (!replyToMsg) return null;

                                  return (
                                    <div
                                      className={`
                                      border-l-4 pl-3 py-2 rounded-r-md text-xs reply-context cursor-pointer
                                      ${
                                        isUser
                                          ? "border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                                          : "border-primary/30 bg-primary/10 hover:bg-primary/20"
                                      }
                                    `}
                                    >
                                      <div
                                        className={`
                                        font-medium mb-1 flex items-center gap-2
                                        ${
                                          isUser
                                            ? "text-primary-foreground/80"
                                            : "text-primary"
                                        }
                                      `}
                                      >
                                        {replyToMsg.role === "user" ? (
                                          <Users className="h-3 w-3" />
                                        ) : (
                                          <Bot className="h-3 w-3" />
                                        )}
                                        {replyToMsg.role === "user"
                                          ? "You"
                                          : companion?.name || "AI"}
                                      </div>
                                      <div
                                        className={`
                                        line-clamp-2 leading-relaxed
                                        ${
                                          isUser
                                            ? "text-primary-foreground/70"
                                            : "text-muted-foreground"
                                        }
                                      `}
                                        style={{
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {replyToMsg.content.length > 80
                                          ? `${replyToMsg.content.substring(
                                              0,
                                              80
                                            )}...`
                                          : replyToMsg.content}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                            {isUser ? (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                              </p>
                            ) : (
                              <MarkdownRenderer
                                content={message.content}
                                className="text-sm leading-relaxed"
                              />
                            )}

                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs ${
                                  isUser
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {format(new Date(message.createdAt), "HH:mm")}
                              </span>

                              <MessageActionsV2
                                messageId={message.id}
                                messageContent={message.content}
                                messageRole={message.role}
                                onReply={handleReplyToMessage}
                                onEdit={handleEditMessage}
                                onDelete={handleDeleteMessage}
                                className={
                                  isUser ? "text-primary-foreground" : ""
                                }
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-6"
          >
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={companion?.avatarUrl || "/placeholder-avatar.png"}
                />
                <AvatarFallback className="bg-muted">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {companion?.name || "AI"} is typing...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Minimal Chat Input - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <MinimalChatInput
            onSendMessage={handleSendMessage}
            userId={session.user.id}
            companionId={companion?.id || ""}
            isLoading={isLoading}
            placeholder={`Message ${companion?.name || "your companion"}...`}
            replyToMessage={replyToMessage}
            onCancelReply={() => setReplyToMessage(null)}
          />
        </div>
      </div>
    </div>
  );
}
