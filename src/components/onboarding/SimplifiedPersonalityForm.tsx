"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sparkles, Heart, Zap, Smile, MessageCircle, User } from "lucide-react";
import { SimplifiedPersonality } from "@/types";
import { toast } from "sonner";

interface SimplifiedPersonalityFormProps {
  onComplete: (personality: SimplifiedPersonality) => void;
  companionName: string;
  companionGender: "male" | "female" | "non-binary";
  initialData?: Partial<SimplifiedPersonality>;
}

export default function SimplifiedPersonalityForm({
  onComplete,
  companionName,
  companionGender,
  initialData,
}: SimplifiedPersonalityFormProps) {
  const [personality, setPersonality] = useState<SimplifiedPersonality>({
    affectionLevel: initialData?.affectionLevel || 5,
    empathyLevel: initialData?.empathyLevel || 5,
    curiosityLevel: initialData?.curiosityLevel || 5,
    playfulness: initialData?.playfulness || 5,
    humorStyle: initialData?.humorStyle || "gentle",
    communicationStyle: initialData?.communicationStyle || "casual",
    userPreferredAddress: initialData?.userPreferredAddress || "you",
    partnerPronouns: initialData?.partnerPronouns || "they/them",
    backStory: initialData?.backStory || "",
    relationshipBackstory: initialData?.relationshipBackstory || {
      howYouMet: "",
      relationshipDuration: "",
      livingSituation: "living_together",
      homeDescription: "",
      partnerQuirks: "",
      sharedMemories: "",
      relationshipDynamics: "",
    },
    backstoryScore: initialData?.backstoryScore,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const handleSliderChange = (
    field: keyof SimplifiedPersonality,
    value: number[]
  ) => {
    setPersonality((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleSelectChange = (
    field: keyof SimplifiedPersonality,
    value: string
  ) => {
    setPersonality((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    field: keyof SimplifiedPersonality,
    value: string
  ) => {
    setPersonality((prev) => ({ ...prev, [field]: value }));
  };

  const handleRelationshipBackstoryChange = (
    field: keyof NonNullable<SimplifiedPersonality["relationshipBackstory"]>,
    value: string
  ) => {
    setPersonality((prev) => ({
      ...prev,
      relationshipBackstory: {
        ...prev.relationshipBackstory,
        [field]: value,
      },
    }));
  };

  const evaluateBackstory = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/backstory/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backstory: personality.backStory,
          relationshipBackstory: personality.relationshipBackstory,
        }),
      });

      if (response.ok) {
        const { score } = await response.json();
        setPersonality((prev) => ({ ...prev, backstoryScore: score }));
        toast.success("Backstory evaluated successfully!");
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

  const improveBackstory = async () => {
    setIsImproving(true);
    try {
      const response = await fetch("/api/backstory/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backstory: personality.backStory,
          relationshipBackstory: personality.relationshipBackstory,
          companionName: companionName,
          companionGender: companionGender,
        }),
      });

      if (response.ok) {
        const { improvedBackstory } = await response.json();
        setPersonality((prev) => ({ ...prev, backStory: improvedBackstory }));
        toast.success("Backstory improved with AI assistance!");
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(personality);
    } catch (error) {
      console.error("Error saving personality:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const traitCards = [
    {
      field: "affectionLevel" as keyof SimplifiedPersonality,
      icon: Heart,
      title: "Affection Level",
      description: "How openly affectionate and loving",
      color: "text-red-500",
    },
    {
      field: "empathyLevel" as keyof SimplifiedPersonality,
      icon: User,
      title: "Empathy Level",
      description: "How understanding and emotionally connected",
      color: "text-blue-500",
    },
    {
      field: "curiosityLevel" as keyof SimplifiedPersonality,
      icon: Sparkles,
      title: "Curiosity Level",
      description: "How inquisitive and interested in learning",
      color: "text-purple-500",
    },
    {
      field: "playfulness" as keyof SimplifiedPersonality,
      icon: Zap,
      title: "Playfulness",
      description: "How fun-loving and spontaneous",
      color: "text-yellow-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-gray-900"
        >
          Customize {companionName}&apos;s Personality
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Fine-tune how {companionName} will interact with you. These settings
          shape their personality and communication style.
        </p>
      </div>

      {/* Personality Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Personality Traits
          </CardTitle>
          <CardDescription>
            Adjust each trait on a scale of 1-10 to shape {companionName}&apos;s
            core personality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {traitCards.map((trait, index) => (
              <motion.div
                key={trait.field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <trait.icon className={`h-5 w-5 ${trait.color}`} />
                  <div className="flex-1">
                    <Label className="text-base font-semibold">
                      {trait.title}
                    </Label>
                    <p className="text-sm text-gray-600">{trait.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {personality[trait.field] as number}
                  </div>
                </div>
                <Slider
                  value={[personality[trait.field] as number]}
                  onValueChange={(value) =>
                    handleSliderChange(trait.field, value)
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
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Communication Style
          </CardTitle>
          <CardDescription>
            Choose how {companionName} expresses themselves and communicates
            with you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="humor-style">Humor Style</Label>
              <Select
                value={personality.humorStyle}
                onValueChange={(value) =>
                  handleSelectChange("humorStyle", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select humor style" />
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="communication-style">Communication Style</Label>
              <Select
                value={personality.communicationStyle}
                onValueChange={(value) =>
                  handleSelectChange("communicationStyle", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
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
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-green-500" />
            Interaction Preferences
          </CardTitle>
          <CardDescription>
            Customize how {companionName} addresses you and their preferred
            pronouns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="user-address">
                How should {companionName} address you?
              </Label>
              <Input
                id="user-address"
                value={personality.userPreferredAddress}
                onChange={(e) =>
                  handleInputChange("userPreferredAddress", e.target.value)
                }
                placeholder="e.g., your name, nickname, or 'you'"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="partner-pronouns">
                {companionName}&apos;s Pronouns
              </Label>
              <Select
                value={personality.partnerPronouns}
                onValueChange={(value) =>
                  handleSelectChange("partnerPronouns", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pronouns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he/him">He/Him</SelectItem>
                  <SelectItem value="she/her">She/Her</SelectItem>
                  <SelectItem value="they/them">They/Them</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Enhanced Relationship Backstory Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-6 col-span-2"
            >
              {/* Section Header */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Your Relationship with {companionName}
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand your relationship history and dynamics to
                  create a more authentic experience.
                </p>
              </div>

              {/* Relationship Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* How You Met */}
                <div className="space-y-2">
                  <Label htmlFor="how-met">How did you two meet? *</Label>
                  <Textarea
                    id="how-met"
                    value={personality.relationshipBackstory?.howYouMet || ""}
                    onChange={(e) =>
                      handleRelationshipBackstoryChange(
                        "howYouMet",
                        e.target.value
                      )
                    }
                    placeholder="Describe where and how you first met... (e.g., college, through friends, online, at work)"
                    className="min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>

                {/* Relationship Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    How long have you been together? *
                  </Label>
                  <Input
                    id="duration"
                    value={
                      personality.relationshipBackstory?.relationshipDuration ||
                      ""
                    }
                    onChange={(e) =>
                      handleRelationshipBackstoryChange(
                        "relationshipDuration",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 2 years, 6 months, 5 years"
                  />
                </div>

                {/* Living Situation */}
                <div className="space-y-2">
                  <Label htmlFor="living-situation">
                    Current living situation *
                  </Label>
                  <Select
                    value={
                      personality.relationshipBackstory?.livingSituation ||
                      "living_together"
                    }
                    onValueChange={(value) =>
                      handleRelationshipBackstoryChange(
                        "livingSituation",
                        value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your living situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living_together">
                        Living together
                      </SelectItem>
                      <SelectItem value="visiting_often">
                        Visit each other often
                      </SelectItem>
                      <SelectItem value="long_distance">
                        Long distance relationship
                      </SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="engaged">Engaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Partner Quirks */}
                <div className="space-y-2">
                  <Label htmlFor="quirks">
                    {companionName}&apos;s unique quirks *
                  </Label>
                  <Textarea
                    id="quirks"
                    value={
                      personality.relationshipBackstory?.partnerQuirks || ""
                    }
                    onChange={(e) =>
                      handleRelationshipBackstoryChange(
                        "partnerQuirks",
                        e.target.value
                      )
                    }
                    placeholder="What makes them special? Habits, preferences, funny things they do..."
                    className="min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Home Description */}
              <div className="space-y-2">
                <Label htmlFor="home">Describe your home/apartment *</Label>
                <Textarea
                  id="home"
                  value={
                    personality.relationshipBackstory?.homeDescription || ""
                  }
                  onChange={(e) =>
                    handleRelationshipBackstoryChange(
                      "homeDescription",
                      e.target.value
                    )
                  }
                  placeholder="What's your living space like? Layout, style, favorite spots, what makes it feel like home..."
                  className="min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              {/* Shared Memories */}
              <div className="space-y-2">
                <Label htmlFor="memories">Special memories together *</Label>
                <Textarea
                  id="memories"
                  value={
                    personality.relationshipBackstory?.sharedMemories || ""
                  }
                  onChange={(e) =>
                    handleRelationshipBackstoryChange(
                      "sharedMemories",
                      e.target.value
                    )
                  }
                  placeholder="Favorite trips, special moments, inside jokes, traditions you share..."
                  className="min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              {/* Relationship Dynamics */}
              <div className="space-y-2">
                <Label htmlFor="dynamics">Relationship dynamics *</Label>
                <Textarea
                  id="dynamics"
                  value={
                    personality.relationshipBackstory?.relationshipDynamics ||
                    ""
                  }
                  onChange={(e) =>
                    handleRelationshipBackstoryChange(
                      "relationshipDynamics",
                      e.target.value
                    )
                  }
                  placeholder="How do you interact? Who's the planner? Who cooks? Daily routines you share..."
                  className="min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              {/* Overall Backstory */}
              <div className="space-y-2">
                <Label htmlFor="back-story">
                  Overall character background (Optional)
                </Label>
                <Textarea
                  id="back-story"
                  value={personality.backStory || ""}
                  onChange={(e) =>
                    handleInputChange("backStory", e.target.value)
                  }
                  placeholder="Additional background story, personality details, or narrative that helps define who they are..."
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Add any additional background story or character
                  details.
                </p>
              </div>

              {/* Backstory Score and AI Tools */}
              {personality.backstoryScore && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">
                    Backstory Quality Score
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-600">
                        {personality.backstoryScore.overall}/100
                      </div>
                      <div className="text-muted-foreground">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-600">
                        {personality.backstoryScore.criteria.detail}/100
                      </div>
                      <div className="text-muted-foreground">Detail</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-purple-600">
                        {personality.backstoryScore.criteria.emotional_depth}
                        /100
                      </div>
                      <div className="text-muted-foreground">Emotion</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-orange-600">
                        {personality.backstoryScore.criteria.uniqueness}/100
                      </div>
                      <div className="text-muted-foreground">Unique</div>
                    </div>
                  </div>
                  {personality.backstoryScore.suggestions &&
                    personality.backstoryScore.suggestions.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-sm mb-2">
                          Suggestions for improvement:
                        </h5>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {personality.backstoryScore.suggestions.map(
                            (suggestion, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span className="text-blue-500 mt-0.5">•</span>
                                {suggestion}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              {/* AI Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={evaluateBackstory}
                  disabled={isEvaluating}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {isEvaluating ? "Evaluating..." : "Evaluate Backstory"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={improveBackstory}
                  disabled={isImproving}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isImproving ? "Improving..." : "Improve with AI"}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                * Required fields help create a more authentic and personalized
                experience
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">
              Personality Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Affection Level:</strong> {personality.affectionLevel}/10
            </div>
            <div>
              <strong>Empathy Level:</strong> {personality.empathyLevel}/10
            </div>
            <div>
              <strong>Curiosity Level:</strong> {personality.curiosityLevel}/10
            </div>
            <div>
              <strong>Playfulness:</strong> {personality.playfulness}/10
            </div>
            <div>
              <strong>Humor Style:</strong> {personality.humorStyle}
            </div>
            <div>
              <strong>Communication Style:</strong>{" "}
              {personality.communicationStyle}
            </div>
            <div>
              <strong>Address user as:</strong>{" "}
              {personality.userPreferredAddress}
            </div>
            <div>
              <strong>Use pronouns:</strong> {personality.partnerPronouns}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="flex justify-center pt-6"
      >
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? "Saving..." : `Complete ${companionName}'s Setup`}
        </Button>
      </motion.div>
    </motion.div>
  );
}
