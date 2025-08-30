"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  User,
  Brain,
  MessageSquare,
  Settings as SettingsIcon,
  Trash2,
  Heart,
  Sparkles,
  Zap,
  Tag,
  Clock,
  Star,
  AlertTriangle,
  Camera,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { SimplifiedMemory } from "@/types";
import AvatarSelection from "@/components/settings/AvatarSelection";
import { ThemeToggle } from "@/components/theme-toggle";

interface CompanionData {
  name: string;
  gender: string;
  affectionLevel: number;
  empathyLevel: number;
  curiosityLevel: number;
  playfulness: number;
  humorStyle: string;
  communicationStyle: string;
  userPreferredAddress: string;
  partnerPronouns: string;
  avatarUrl?: string;
  backStory?: string;
  relationshipBackstory?: {
    howYouMet?: string;
    relationshipDuration?: string;
    livingSituation?: string;
    homeDescription?: string;
    partnerQuirks?: string;
    sharedMemories?: string;
    relationshipDynamics?: string;
  };
  backstoryScore?: {
    overall: number;
    criteria: {
      detail: number;
      consistency: number;
      emotional_depth: number;
      uniqueness: number;
    };
    suggestions?: string[];
    lastEvaluated?: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companionData, setCompanionData] = useState<CompanionData | null>(
    null
  );
  const [memories, setMemories] = useState<SimplifiedMemory[]>([]);
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearChatDialog, setShowClearChatDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Load companion data and memories
  useEffect(() => {
    if (session?.user) {
      loadCompanionData();
      loadMemories();
    }
  }, [session?.user]);

  const loadCompanionData = async () => {
    try {
      const response = await fetch("/api/personality");
      if (response.ok) {
        const data = await response.json();
        if (data.companion) {
          setCompanionData(data.companion);
        }
      }
    } catch (error) {
      console.error("Error loading companion data:", error);
      toast.error("Failed to load companion data");
    }
  };

  const loadMemories = async () => {
    try {
      const response = await fetch("/api/memories");
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories || []);
      }
    } catch (error) {
      console.error("Error loading memories:", error);
      toast.error("Failed to load memories");
    }
  };

  const handlePersonalityUpdate = async () => {
    if (!companionData) return;

    setLoading(true);
    try {
      const response = await fetch("/api/personality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companionData),
      });

      if (response.ok) {
        toast.success("Personality updated successfully!");
      } else {
        throw new Error("Failed to update personality");
      }
    } catch (error) {
      console.error("Error updating personality:", error);
      toast.error("Failed to update personality");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string, _avatarId: string) => {
    if (!companionData) return;

    setIsUpdating(true);
    try {
      const updatedData = { ...companionData, avatarUrl };

      const response = await fetch("/api/personality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setCompanionData(updatedData);
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSelectedMemories = async () => {
    if (selectedMemories.length === 0) return;

    setLoading(true);
    try {
      for (const memoryId of selectedMemories) {
        await fetch(`/api/memories?id=${memoryId}`, {
          method: "DELETE",
        });
      }

      toast.success(`Deleted ${selectedMemories.length} memories`);
      setSelectedMemories([]);
      setShowDeleteDialog(false);
      loadMemories(); // Reload memories
    } catch (error) {
      console.error("Error deleting memories:", error);
      toast.error("Failed to delete memories");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllChats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/messages?clearAll=true", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("All chat history cleared!");
        setShowClearChatDialog(false);
      } else {
        throw new Error("Failed to clear chats");
      }
    } catch (error) {
      console.error("Error clearing chats:", error);
      toast.error("Failed to clear chat history");
    } finally {
      setLoading(false);
    }
  };

  const toggleMemorySelection = (memoryId: string) => {
    setSelectedMemories((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const selectAllMemories = () => {
    setSelectedMemories(memories.map((m) => m.id));
  };

  const clearSelection = () => {
    setSelectedMemories([]);
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "text-red-500";
    if (importance >= 6) return "text-yellow-500";
    return "text-gray-500";
  };

  // Backstory AI functions
  const saveBackstory = async (data: Partial<CompanionData>) => {
    try {
      await fetch("/api/user/companion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error saving backstory:", error);
    }
  };

  const handleBackstoryChange = (value: string) => {
    setCompanionData((prev) => {
      if (!prev) return null;
      const newData = { ...prev, backStory: value };

      // Immediate save
      saveBackstory({ backStory: value });

      return newData;
    });
  };

  const handleEvaluateBackstory = async () => {
    if (!companionData?.backStory?.trim()) {
      toast.error("Please provide a backstory first");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch("/api/backstory/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backstory: companionData.backStory,
          companionName: companionData.name,
          companionGender: companionData.gender,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCompanionData((prev) =>
          prev
            ? {
                ...prev,
                backstoryScore: result.score,
              }
            : null
        );

        // Also update the companion in the database
        await fetch("/api/user/companion", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            backstoryScore: result.score,
          }),
        });

        toast.success(
          `Backstory evaluated! Score: ${
            typeof result.score === "object"
              ? (result.score.overall / 10).toFixed(1)
              : (result.score / 10).toFixed(1)
          }/10`
        );
      } else {
        throw new Error("Failed to evaluate backstory");
      }
    } catch (error) {
      console.error("Error evaluating backstory:", error);
      toast.error("Failed to evaluate backstory");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleImproveBackstory = async () => {
    if (!companionData?.backStory?.trim()) {
      toast.error("Please provide a backstory first");
      return;
    }

    setIsImproving(true);
    try {
      const response = await fetch("/api/backstory/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backstory: companionData.backStory,
          companionName: companionData.name,
          companionGender: companionData.gender,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update the backstory immediately
        setCompanionData((prev) =>
          prev
            ? {
                ...prev,
                backStory: result.improvedBackstory,
                backstoryScore: result.score,
              }
            : null
        );

        // Save to database immediately
        await saveBackstory({
          backStory: result.improvedBackstory,
          backstoryScore: result.score,
        });

        toast.success(
          `Backstory improved! New score: ${
            typeof result.score === "object"
              ? (result.score.overall / 10).toFixed(1)
              : (result.score / 10).toFixed(1)
          }/10`
        );
      } else {
        throw new Error("Failed to improve backstory");
      }
    } catch (error) {
      console.error("Error improving backstory:", error);
      toast.error("Failed to improve backstory");
    } finally {
      setIsImproving(false);
    }
  };

  // Prevent hydration mismatch and wait for data
  if (!mounted || status === "loading" || !session?.user || !companionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {status === "loading" ? "Authenticating..." : "Loading settings..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/90 backdrop-blur-sm border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/chat/simplified")}
              className="text-purple-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="personality" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="personality"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="avatar" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="memories" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Personality Settings */}
          <TabsContent value="personality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Companion Personality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Companion Name</Label>
                    <Input
                      value={companionData.name}
                      onChange={(e) =>
                        setCompanionData((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>How to Address You</Label>
                    <Input
                      value={companionData.userPreferredAddress}
                      onChange={(e) =>
                        setCompanionData((prev) =>
                          prev
                            ? { ...prev, userPreferredAddress: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                </div>

                {/* Comprehensive Backstory Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      Relationship Backstory
                    </Label>
                    {companionData.backstoryScore && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">AI Score:</span>
                        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {typeof companionData.backstoryScore === "object"
                            ? (
                                companionData.backstoryScore.overall / 10
                              ).toFixed(1)
                            : (companionData.backstoryScore / 10).toFixed(1)}
                          /10
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        Tell us your complete relationship story. Include
                        details about:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>🤝 How you two met and your first impressions</li>
                        <li>
                          ⏰ How long you&apos;ve been together and relationship
                          timeline
                        </li>
                        <li>
                          💫 Their personality, quirks, and what makes them
                          special
                        </li>
                        <li>
                          🏠 Your living situation (dating, living together,
                          married, etc.)
                        </li>
                        <li>
                          🏡 Description of your home/apartment and daily life
                        </li>
                        <li>
                          💕 Special memories, inside jokes, and shared
                          experiences
                        </li>
                        <li>🌟 Relationship dynamics and how you interact</li>
                      </ul>
                    </div>

                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[300px] text-sm"
                      placeholder={`Write your complete relationship story here. You can use markdown formatting:

**How we met**: Describe your first meeting...

**Their personality**: What makes them unique...

**Our timeline**: How long together, relationship milestones...

**Living situation**: Are you dating, living together, married...

**Our home**: Describe your living space and daily routines...

**Special memories**: Favorite moments, inside jokes, traditions...

**What makes us work**: Your relationship dynamics and connection...

Feel free to write as much detail as you want - the more specific and personal, the better!`}
                      value={companionData.backStory || ""}
                      onChange={(e) => handleBackstoryChange(e.target.value)}
                    />
                  </div>

                  {/* AI Tools */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleEvaluateBackstory}
                      disabled={
                        isEvaluating || !companionData.backStory?.trim()
                      }
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Get AI Score
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleImproveBackstory}
                      disabled={isImproving || !companionData.backStory?.trim()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isImproving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          Improving...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Improve with AI
                        </>
                      )}
                    </Button>

                    <div className="flex-1"></div>

                    <div className="text-xs text-gray-500 self-center">
                      {companionData.backStory?.length || 0} characters
                      {companionData.backStory &&
                        companionData.backStory.length > 0 &&
                        " • Auto-saved"}
                    </div>
                  </div>
                </div>

                {/* Personality Traits */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Personality Traits</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        field: "affectionLevel" as keyof CompanionData,
                        icon: Heart,
                        title: "Affection Level",
                        color: "text-red-500",
                      },
                      {
                        field: "empathyLevel" as keyof CompanionData,
                        icon: Brain,
                        title: "Empathy Level",
                        color: "text-blue-500",
                      },
                      {
                        field: "curiosityLevel" as keyof CompanionData,
                        icon: Sparkles,
                        title: "Curiosity Level",
                        color: "text-purple-500",
                      },
                      {
                        field: "playfulness" as keyof CompanionData,
                        icon: Zap,
                        title: "Playfulness",
                        color: "text-yellow-500",
                      },
                    ].map((trait) => (
                      <div key={trait.field} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <trait.icon className={`h-5 w-5 ${trait.color}`} />
                          <Label className="text-base font-medium">
                            {trait.title}
                          </Label>
                          <div className="text-2xl font-bold text-purple-600 ml-auto">
                            {companionData[trait.field] as number}
                          </div>
                        </div>
                        <Slider
                          value={[companionData[trait.field] as number]}
                          onValueChange={(value) =>
                            setCompanionData((prev) =>
                              prev ? { ...prev, [trait.field]: value[0] } : null
                            )
                          }
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Low</span>
                          <span>Medium</span>
                          <span>High</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication Styles */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Humor Style</Label>
                    <Select
                      value={companionData.humorStyle}
                      onValueChange={(value) =>
                        setCompanionData((prev) =>
                          prev ? { ...prev, humorStyle: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playful">
                          🎭 Playful - Light and fun
                        </SelectItem>
                        <SelectItem value="witty">
                          🧠 Witty - Clever and sharp
                        </SelectItem>
                        <SelectItem value="gentle">
                          😊 Gentle - Soft and warm
                        </SelectItem>
                        <SelectItem value="sarcastic">
                          😏 Sarcastic - Dry and ironic
                        </SelectItem>
                        <SelectItem value="serious">
                          🎯 Serious - Focused and direct
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Communication Style</Label>
                    <Select
                      value={companionData.communicationStyle}
                      onValueChange={(value) =>
                        setCompanionData((prev) =>
                          prev ? { ...prev, communicationStyle: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">
                          👕 Casual - Relaxed and informal
                        </SelectItem>
                        <SelectItem value="formal">
                          👔 Formal - Professional and structured
                        </SelectItem>
                        <SelectItem value="intimate">
                          💕 Intimate - Close and personal
                        </SelectItem>
                        <SelectItem value="professional">
                          💼 Professional - Business-like
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handlePersonalityUpdate}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? "Updating..." : "Save Personality Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="avatar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Companion Avatar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AvatarSelection
                  currentAvatarUrl={companionData?.avatarUrl}
                  onAvatarSelect={handleAvatarUpdate}
                  isLoading={isUpdating}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Theme & Appearance
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize the visual appearance of your app
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Toggle Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Color Theme</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose between light, dark, or system theme
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">Theme Mode</div>
                      <div className="text-sm text-muted-foreground">
                        Switch between light and dark appearance
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Additional appearance settings can be added here */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Display Settings
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      More appearance options coming soon
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-border">
                    <div className="text-center text-muted-foreground">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Additional theme customization options will be available
                        in future updates
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memory Management */}
          <TabsContent value="memories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Memory Management
                  </div>
                  <Badge variant="outline">
                    {memories.length} Total Memories
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Memory Controls */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="text-sm text-gray-600">
                    {selectedMemories.length > 0 ? (
                      <span>{selectedMemories.length} memories selected</span>
                    ) : (
                      <span>Select memories to delete</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllMemories}
                    >
                      <span className="sm:hidden">All</span>
                      <span className="hidden sm:inline">Select All</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      <span className="sm:hidden">Clear</span>
                      <span className="hidden sm:inline">Clear Selection</span>
                    </Button>
                    {selectedMemories.length > 0 && (
                      <Dialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="sm:hidden">Delete</span>
                            <span className="hidden sm:inline">
                              Delete Selected
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Memories</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete{" "}
                              {selectedMemories.length} selected memories? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteSelectedMemories}
                            >
                              Delete {selectedMemories.length} Memories
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {/* Memory List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {memories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No memories found</p>
                      <p className="text-sm">
                        Start chatting to create memories!
                      </p>
                    </div>
                  ) : (
                    memories.map((memory) => (
                      <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedMemories.includes(memory.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleMemorySelection(memory.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm text-gray-900">
                              {memory.content}
                            </p>

                            {/* Tags */}
                            {memory.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {memory.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                  memory.createdAt
                                ).toLocaleDateString()}
                              </div>
                              <div
                                className={`flex items-center gap-1 ${getImportanceColor(
                                  memory.importance
                                )}`}
                              >
                                <Star className="h-3 w-3" />
                                {memory.importance}/10
                              </div>
                              {memory.userCreated && (
                                <Badge variant="outline" className="text-xs">
                                  User Created
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Settings */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Chat Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Clear Chat History */}
                <div className="border border-red-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="font-semibold">Danger Zone</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Clear All Chat History
                      </h4>
                      <p className="text-sm text-gray-600">
                        This will permanently delete all your conversation
                        history. Memories will not be affected.
                      </p>
                    </div>

                    <Dialog
                      open={showClearChatDialog}
                      onOpenChange={setShowClearChatDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear All Chats
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Clear All Chat History</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete all your chat
                            conversations? This action cannot be undone. Your
                            memories will remain intact.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowClearChatDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleClearAllChats}
                          >
                            Yes, Clear All Chats
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Chat Features Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Chat Features
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Memory tagging available during conversations
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI responses adapt to your personality settings
                    </li>
                    <li className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Manual memory selection for context
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}