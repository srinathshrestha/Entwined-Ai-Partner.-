import { z } from "zod";

// Define RelationshipStatus enum directly
const RelationshipStatus = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ENDED: "ENDED",
} as const;

// =============================================================================
// ONBOARDING STEP 1: BASIC PROFILE VALIDATION
// =============================================================================

export const basicUserProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(99, "Age must be realistic")
    .int("Age must be a whole number"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be 100 characters or less"),
  occupation: z
    .string()
    .min(1, "Occupation is required")
    .max(100, "Occupation must be 100 characters or less"),
});

export const basicCompanionProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Partner name is required")
    .max(50, "Name must be 50 characters or less")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  gender: z.enum(["male", "female", "non-binary"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(99, "Age must be realistic")
    .int("Age must be a whole number"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be 100 characters or less"),
  occupation: z
    .string()
    .min(1, "Occupation is required")
    .max(100, "Occupation must be 100 characters or less"),
  avatar: z.string().optional(),
});

export const basicRelationshipInfoSchema = z.object({
  status: z.nativeEnum(RelationshipStatus, {
    errorMap: () => ({ message: "Please select a relationship status" }),
  }),
});

export const onboardingStep1Schema = z.object({
  user: basicUserProfileSchema,
  companion: basicCompanionProfileSchema,
  relationship: basicRelationshipInfoSchema,
});

// =============================================================================
// ONBOARDING STEP 2: PSYCHOLOGICAL PROFILING VALIDATION
// =============================================================================

export const userPsychologySchema = z.object({
  // Core Behavioral Patterns
  conflictStyle: z.enum(
    [
      "avoids_conflict",
      "direct_confrontation",
      "passive_aggressive",
      "seeks_compromise",
    ],
    {
      errorMap: () => ({ message: "Please select how you handle conflict" }),
    }
  ),
  emotionalExpression: z.enum(
    ["highly_expressive", "reserved", "selective_sharing", "emotional_walls"],
    {
      errorMap: () => ({ message: "Please select how you express emotions" }),
    }
  ),
  decisionMaking: z.enum(
    ["impulsive", "analytical", "seeks_validation", "independent"],
    {
      errorMap: () => ({ message: "Please select your decision-making style" }),
    }
  ),
  stressResponse: z.enum(
    ["withdraws", "seeks_comfort", "becomes_irritable", "overthinks"],
    {
      errorMap: () => ({ message: "Please select how you respond to stress" }),
    }
  ),

  // Relationship Dynamics
  attachmentStyle: z.enum(["secure", "anxious", "avoidant", "disorganized"], {
    errorMap: () => ({ message: "Please select your attachment style" }),
  }),
  loveLanguage: z.enum(
    [
      "words_of_affirmation",
      "physical_touch",
      "quality_time",
      "acts_of_service",
      "gifts",
    ],
    {
      errorMap: () => ({ message: "Please select your love language" }),
    }
  ),
  vulnerabilityComfort: z.enum(
    ["very_open", "selective", "guarded", "extremely_private"],
    {
      errorMap: () => ({
        message: "Please select your vulnerability comfort level",
      }),
    }
  ),

  // Power Dynamics
  authorityResponse: z.enum(
    ["respects_authority", "questions_authority", "rebels_against_authority"],
    {
      errorMap: () => ({
        message: "Please select how you respond to authority",
      }),
    }
  ),
  leadership: z.enum(
    [
      "natural_leader",
      "prefers_following",
      "situational_leader",
      "avoids_responsibility",
    ],
    {
      errorMap: () => ({ message: "Please select your leadership style" }),
    }
  ),

  // Motivations & Triggers
  primaryMotivations: z
    .array(z.string())
    .min(1, "Please select at least one motivation")
    .max(5, "Please select no more than 5 motivations"),
  emotionalTriggers: z
    .array(z.string())
    .min(1, "Please select at least one emotional trigger")
    .max(5, "Please select no more than 5 triggers"),
  comfortSources: z
    .array(z.string())
    .min(1, "Please select at least one comfort source")
    .max(5, "Please select no more than 5 comfort sources"),
});

export const partnerDesignSchema = z.object({
  // Core Personality Framework
  dominanceLevel: z.enum(
    [
      "highly_dominant",
      "assertive",
      "balanced",
      "submissive",
      "highly_submissive",
    ],
    {
      errorMap: () => ({
        message: "Please select your partner's dominance level",
      }),
    }
  ),
  emotionalRange: z.enum(
    ["very_expressive", "moderately_expressive", "controlled", "stoic"],
    {
      errorMap: () => ({
        message: "Please select your partner's emotional range",
      }),
    }
  ),
  adaptability: z.enum(
    ["highly_adaptive", "somewhat_flexible", "consistent", "rigid"],
    {
      errorMap: () => ({
        message: "Please select your partner's adaptability",
      }),
    }
  ),

  // Response Patterns to User Behaviors
  userMisbehavior: z.enum(
    [
      "authoritative_correction",
      "gentle_guidance",
      "playful_teasing",
      "ignores_it",
    ],
    {
      errorMap: () => ({
        message:
          "Please select how your partner should handle your misbehavior",
      }),
    }
  ),
  userSadness: z.enum(
    ["immediate_comfort", "problem_solving", "distraction", "gives_space"],
    {
      errorMap: () => ({
        message:
          "Please select how your partner should respond when you're sad",
      }),
    }
  ),
  userAnger: z.enum(
    ["calming_presence", "matches_energy", "defensive", "withdraws"],
    {
      errorMap: () => ({
        message:
          "Please select how your partner should respond when you're angry",
      }),
    }
  ),
  userExcitement: z.enum(
    ["matches_enthusiasm", "gentle_grounding", "supportive_observer"],
    {
      errorMap: () => ({
        message:
          "Please select how your partner should respond when you're excited",
      }),
    }
  ),

  // Communication Patterns
  conflictApproach: z.enum(
    [
      "direct_discussion",
      "emotional_appeal",
      "logical_reasoning",
      "avoids_conflict",
    ],
    {
      errorMap: () => ({
        message: "Please select how your partner should handle conflicts",
      }),
    }
  ),
  affectionStyle: z.enum(
    ["very_physical", "verbally_loving", "acts_of_service", "quality_time"],
    {
      errorMap: () => ({
        message: "Please select how your partner should show affection",
      }),
    }
  ),
  humorStyle: z.enum(
    ["playful_teasing", "witty_banter", "gentle_humor", "serious_nature"],
    {
      errorMap: () => ({ message: "Please select your partner's humor style" }),
    }
  ),

  // Relationship Role
  protectiveness: z.enum(
    ["highly_protective", "supportive", "encouraging_independence"],
    {
      errorMap: () => ({
        message: "Please select your partner's protectiveness level",
      }),
    }
  ),
  initiative: z.enum(["takes_charge", "collaborative", "follows_user_lead"], {
    errorMap: () => ({ message: "Please select who should take initiative" }),
  }),
  jealousyLevel: z.enum(
    ["very_jealous", "mildly_jealous", "secure", "encourages_friendships"],
    {
      errorMap: () => ({
        message: "Please select your partner's jealousy level",
      }),
    }
  ),
});

export const onboardingStep2Schema = z.object({
  user: userPsychologySchema,
  companion: partnerDesignSchema,
});

// =============================================================================
// ONBOARDING STEP 3: RELATIONSHIP CONTEXT VALIDATION
// =============================================================================

export const relationshipHistorySchema = z.object({
  // Origin Story
  howMet: z
    .string()
    .min(1, "Please tell us how you met")
    .max(2000, "Must be 2000 characters or less"),
  firstImpression: z
    .string()
    .min(1, "Please share your first impression")
    .max(2000, "Must be 2000 characters or less"),
  relationshipProgression: z
    .string()
    .min(1, "Please describe how your relationship progressed")
    .max(2000, "Must be 2000 characters or less"),

  // Memorable Moments
  bestMemory: z
    .string()
    .min(1, "Please share your best memory together")
    .max(2000, "Must be 2000 characters or less"),
  funniest_moment: z
    .string()
    .min(1, "Please share your funniest moment")
    .max(2000, "Must be 2000 characters or less"),
  first_kiss_story: z
    .string()
    .min(1, "Please tell us about your first kiss")
    .max(2000, "Must be 2000 characters or less"),
  biggest_challenge_overcome: z
    .string()
    .min(1, "Please share the biggest challenge you've overcome")
    .max(2000, "Must be 2000 characters or less"),

  // Current Dynamic
  living_situation: z
    .string()
    .min(1, "Please describe your living situation")
    .max(1000, "Must be 1000 characters or less"),
  daily_routine: z
    .string()
    .min(1, "Please describe your daily routine together")
    .max(2000, "Must be 2000 characters or less"),
  special_traditions: z
    .string()
    .min(1, "Please share your special traditions")
    .max(1000, "Must be 1000 characters or less"),
  future_plans: z
    .string()
    .min(1, "Please share your future plans")
    .max(2000, "Must be 2000 characters or less"),
});

export const earlyRelationshipSchema = z.object({
  howMet: z
    .string()
    .min(1, "Please tell us how you met")
    .max(2000, "Must be 2000 characters or less"),
  initial_attraction: z
    .string()
    .min(1, "Please share what initially attracted you")
    .max(2000, "Must be 2000 characters or less"),
  current_stage: z
    .string()
    .min(1, "Please describe where you are now")
    .max(2000, "Must be 2000 characters or less"),
  hopes_for_future: z
    .string()
    .min(1, "Please share your hopes for the future")
    .max(2000, "Must be 2000 characters or less"),
});

export const onboardingStep3Schema = z.object({
  relationship: z.union([relationshipHistorySchema, earlyRelationshipSchema]),
});

// =============================================================================
// ONBOARDING STEP 4: CONTENT BOUNDARIES VALIDATION
// =============================================================================

export const contentBoundariesSchema = z.object({
  topicsToAvoid: z
    .array(z.string().max(100))
    .max(20, "Maximum 20 topics to avoid")
    .optional()
    .default([]),
  comfortLevels: z.object({
    matureContent: z.enum(["strict", "moderate", "open"], {
      errorMap: () => ({
        message: "Please select a comfort level for mature content",
      }),
    }),
    conversationDepth: z.enum(["surface", "moderate", "deep"], {
      errorMap: () => ({
        message: "Please select a conversation depth preference",
      }),
    }),
  }),
  hardBoundaries: z
    .array(z.string().max(200))
    .max(10, "Maximum 10 hard boundaries")
    .optional()
    .default([]),
  triggerWarnings: z
    .array(z.string().max(100))
    .max(20, "Maximum 20 trigger warnings")
    .optional()
    .default([]),
});

export const onboardingStep4Schema = z.object({
  contentBoundaries: contentBoundariesSchema,
});

// =============================================================================
// COMPLETE ONBOARDING VALIDATION
// =============================================================================

export const completeOnboardingSchema = z.object({
  step1: onboardingStep1Schema,
  step2: onboardingStep2Schema,
  step3: onboardingStep3Schema,
  step4: onboardingStep4Schema,
});

// =============================================================================
// CHAT MESSAGE VALIDATION
// =============================================================================

export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message must be 4000 characters or less"),
  replyToId: z.string().cuid().optional(),
});

export const editMessageSchema = z.object({
  messageId: z.string().cuid(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message must be 4000 characters or less"),
});

// =============================================================================
// MEMORY VALIDATION
// =============================================================================

export const memoryCreationSchema = z.object({
  content: z
    .string()
    .min(1, "Memory content is required")
    .max(2000, "Memory content must be 2000 characters or less"),
  importance: z
    .number()
    .min(1, "Importance must be at least 1")
    .max(10, "Importance must be at most 10")
    .int("Importance must be a whole number"),
  category: z
    .string()
    .max(50, "Category must be 50 characters or less")
    .optional(),
  tags: z
    .array(z.string().max(30))
    .max(10, "Maximum 10 tags per memory")
    .optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;
export type CompleteOnboardingData = z.infer<typeof completeOnboardingSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;
export type EditMessageData = z.infer<typeof editMessageSchema>;
export type MemoryCreationData = z.infer<typeof memoryCreationSchema>;
export type UserPsychologyData = z.infer<typeof userPsychologySchema>;
export type PartnerDesignData = z.infer<typeof partnerDesignSchema>;
export type RelationshipHistoryData = z.infer<typeof relationshipHistorySchema>;
export type EarlyRelationshipData = z.infer<typeof earlyRelationshipSchema>;
