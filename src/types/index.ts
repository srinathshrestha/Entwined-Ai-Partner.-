import {
  User,
  Companion,
  RelationshipDynamic,
  Conversation,
  Message,
  Memory,
  UserPreferences,
  MessageRole,
  MemoryType,
  RelationshipStatus,
  DeletedBy,
} from "@prisma/client";

// =============================================================================
// SIMPLIFIED PERSONALITY SYSTEM
// =============================================================================

export interface SimplifiedPersonality {
  // Core Personality Traits (1-10 scale)
  affectionLevel: number; // 1-10: How openly affectionate
  empathyLevel: number; // 1-10: How empathetic and understanding
  curiosityLevel: number; // 1-10: How curious and inquisitive
  playfulness: number; // 1-10: How playful and fun-loving

  // Style Preferences
  humorStyle: "playful" | "witty" | "gentle" | "sarcastic" | "serious";
  communicationStyle: "casual" | "formal" | "intimate" | "professional";

  // Interaction Preferences
  userPreferredAddress: string; // How to address the user (name, nickname, etc.)
  partnerPronouns: "he/him" | "she/her" | "they/them" | "other";

  // Character Background & Story
  backStory?: string; // Detailed character background, history, and personality narrative

  // Enhanced Relationship Backstory
  relationshipBackstory?: {
    howYouMet?: string; // Where and how you first met
    relationshipDuration?: string; // How long you've been together
    livingSituation?:
      | "living_together"
      | "visiting_often"
      | "long_distance"
      | "married"
      | "engaged";
    homeDescription?: string; // Description of your shared space/apartment
    partnerQuirks?: string; // Unique habits, quirks, and characteristics
    sharedMemories?: string; // Special moments and experiences together
    relationshipDynamics?: string; // How you interact, who does what, etc.
  };

  // Backstory Quality Score (calculated by AI)
  backstoryScore?: {
    overall: number; // 1-100 overall quality score
    criteria: {
      detail: number; // How detailed and rich the backstory is
      consistency: number; // How consistent and believable it is
      emotional_depth: number; // Emotional richness and connection
      uniqueness: number; // How unique and personal it feels
    };
    suggestions?: string[]; // AI suggestions for improvement
    lastEvaluated?: Date;
  };
}

export interface SimplifiedMemory {
  id: string;
  userId: string;
  content: string;
  tags: string[]; // User-defined tags for easy retrieval
  importance: number; // 1-10 scale
  createdAt: Date;
  lastAccessed?: Date;
  emotionalContext?: string;
  userCreated: boolean; // Whether memory was created by user or AI
}







// =============================================================================
// ONBOARDING FORM TYPES
// =============================================================================

// =============================================================================
// CHAT TYPES
// =============================================================================

export interface ChatMessage extends Message {
  conversation: Conversation;
  replyTo?: Message;
  replies?: Message[];
}

export interface MessageWithContext {
  message: Message;
  relatedMemories: Memory[];
  conversationContext: Message[];
}

// =============================================================================
// MEMORY TYPES
// =============================================================================

export interface MemoryWithMetadata extends Memory {
  sourceMessage?: Message;
  relatedConversation?: Conversation;
}

export interface MemoryCreationRequest {
  content: string;
  type: MemoryType;
  importance: number;
  sourceMessageId?: string;
  category?: string;
  tags?: string[];
}

export interface MemorySearchResult {
  memory: Memory;
  similarity: number;
  relevanceScore: number;
}

// =============================================================================
// CONTEXT ASSEMBLY TYPES
// =============================================================================

export interface StaticContext {
  userProfile: User;
  companionProfile: Companion;
  relationshipDynamic: RelationshipDynamic;
}

export interface DynamicContext {
  recentMessages: Message[];
  relevantMemories: MemorySearchResult[];
  currentMood?: string;
  timeContext: {
    time: string;
    day: string;
    season: string;
  };
  conversationTone: string;
}



// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  isComplete: boolean;
  nextStep?: number;
}

// =============================================================================
// EXPORT PRISMA TYPES
// =============================================================================

export type {
  User,
  Companion,
  RelationshipDynamic,
  Conversation,
  Message,
  Memory,
  UserPreferences,
  MessageRole,
  MemoryType,
  RelationshipStatus,
  DeletedBy,
};

// =============================================================================
// OPTION CONSTANTS
// =============================================================================

export const MOTIVATIONS = [
  "achievement",
  "security",
  "connection",
  "freedom",
  "recognition",
  "knowledge",
  "creativity",
  "helping_others",
] as const;

export const EMOTIONAL_TRIGGERS = [
  "feeling_ignored",
  "being_criticized",
  "uncertainty",
  "pressure",
  "feeling_controlled",
  "conflict",
  "rejection",
  "feeling_inadequate",
] as const;

export const COMFORT_SOURCES = [
  "physical_affection",
  "verbal_reassurance",
  "alone_time",
  "problem_solving",
  "distraction",
  "talking_through_feelings",
  "physical_activity",
  "creative_expression",
] as const;
