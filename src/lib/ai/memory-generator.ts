import { SimplifiedMemory } from "@/lib/models/SimplifiedMemory";
import mongoose from "mongoose";

interface MemoryAnalysis {
  shouldCreateMemory: boolean;
  content: string;
  importance: number;
  tags: string[];
  category:
    | "personal"
    | "preference"
    | "relationship"
    | "experience"
    | "knowledge"
    | "emotion";
  emotionalContext?: string;
}

/**
 * Analyzes a user message to determine if it should create a memory
 * and extracts relevant memory information
 */
export function analyzeMessageForMemory(message: string): MemoryAnalysis {
  const lowerMessage = message.toLowerCase();
  const originalMessage = message;

  // Initialize analysis result
  const analysis: MemoryAnalysis = {
    shouldCreateMemory: false,
    content: "",
    importance: 5,
    tags: [],
    category: "experience",
  };

  // Personal information and preferences patterns
  const personalPatterns = [
    // Food preferences and childhood habits
    {
      patterns: [
        /i (love|loved|like|liked|enjoy|enjoyed|hate|hated|dislike|disliked) (to )?(eat|eating) (\w+)/gi,
        /i used to (eat|love|like) (\w+)/gi,
      ],
      category: "preference" as const,
      importance: 7,
      tags: ["food", "preferences"],
    },
    {
      patterns: [
        /i (once )?loved (to )?(eat|eating) (\w+)/gi,
        /when i was (\w+) i (loved|liked|ate) (\w+)/gi,
      ],
      category: "personal" as const,
      importance: 8,
      tags: ["food", "childhood", "personal-history"],
    },
    {
      patterns: [
        /my favorite (food|dish|meal) is/gi,
        /i always (eat|order|cook)/gi,
      ],
      category: "preference" as const,
      importance: 8,
      tags: ["food", "favorites"],
    },
    {
      patterns: [/i'm (allergic to|can't eat|don't like)/gi],
      category: "personal" as const,
      importance: 9,
      tags: ["health", "food", "restrictions"],
    },

    // Personal history and experiences
    {
      patterns: [
        /when i was (young|a kid|little|growing up)/gi,
        /i used to/gi,
        /back when i was/gi,
      ],
      category: "personal" as const,
      importance: 8,
      tags: ["childhood", "personal-history"],
    },
    {
      patterns: [/i once (did|went|tried|experienced)/gi, /i remember when/gi],
      category: "experience" as const,
      importance: 7,
      tags: ["memories", "experiences"],
    },
    {
      patterns: [/and then i grew up/gi, /but now i/gi, /these days i/gi],
      category: "personal" as const,
      importance: 7,
      tags: ["growth", "change", "personal-development"],
    },

    // Likes and dislikes
    {
      patterns: [/i (really )?love/gi, /i'm passionate about/gi, /i enjoy/gi],
      category: "preference" as const,
      importance: 7,
      tags: ["likes", "interests"],
    },
    {
      patterns: [/i (really )?hate/gi, /i can't stand/gi, /i dislike/gi],
      category: "preference" as const,
      importance: 7,
      tags: ["dislikes"],
    },

    // Family and relationships
    {
      patterns: [
        /my (mom|dad|mother|father|parents|family)/gi,
        /my (brother|sister|sibling)/gi,
      ],
      category: "personal" as const,
      importance: 8,
      tags: ["family"],
    },
    {
      patterns: [
        /my (friend|friends|boyfriend|girlfriend|partner|spouse|husband|wife)/gi,
      ],
      category: "relationship" as const,
      importance: 8,
      tags: ["relationships"],
    },

    // Hobbies and interests
    {
      patterns: [/i (play|do|practice) (\w+)/gi, /my hobby is/gi, /i'm into/gi],
      category: "preference" as const,
      importance: 7,
      tags: ["hobbies", "interests"],
    },

    // Work and career
    {
      patterns: [/i work (as|at|in)/gi, /my job is/gi, /i'm a/gi],
      category: "personal" as const,
      importance: 8,
      tags: ["work", "career"],
    },

    // Personality traits
    {
      patterns: [
        /i'm (usually|always|often|sometimes)/gi,
        /i tend to/gi,
        /i'm the type of person who/gi,
      ],
      category: "personal" as const,
      importance: 8,
      tags: ["personality"],
    },

    // Dreams and goals
    {
      patterns: [/i want to/gi, /my dream is/gi, /i hope to/gi, /someday i/gi],
      category: "personal" as const,
      importance: 7,
      tags: ["goals", "dreams"],
    },

    // Fears and concerns
    {
      patterns: [/i'm afraid of/gi, /i worry about/gi, /i fear/gi],
      category: "emotion" as const,
      importance: 8,
      tags: ["fears", "emotions"],
    },

    // Values and beliefs
    {
      patterns: [
        /i believe (in|that)/gi,
        /i think (that )?(\w+) is important/gi,
      ],
      category: "personal" as const,
      importance: 8,
      tags: ["values", "beliefs"],
    },
  ];

  // Check for personal patterns
  for (const pattern of personalPatterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(originalMessage)) {
        analysis.shouldCreateMemory = true;
        analysis.category = pattern.category;
        analysis.importance = pattern.importance;
        analysis.tags.push(...pattern.tags);
        break;
      }
    }
    if (analysis.shouldCreateMemory) break;
  }

  // Additional specific food/taste patterns for the example message
  if (
    lowerMessage.includes("raw sugar") ||
    lowerMessage.includes("sweet") ||
    lowerMessage.includes("candy")
  ) {
    analysis.shouldCreateMemory = true;
    analysis.category = "preference";
    analysis.importance = 7;
    analysis.tags.push("food", "sweets", "childhood", "tastes");
  }

  // Specific patterns for childhood food habits
  if (
    lowerMessage.match(/i (once )?loved? to eat/gi) ||
    lowerMessage.match(/i used to eat/gi)
  ) {
    analysis.shouldCreateMemory = true;
    analysis.category = "personal";
    analysis.importance = 8;
    analysis.tags.push("food", "childhood", "personal-history", "habits");
  }

  // Life transition patterns (growing up, changing)
  if (
    lowerMessage.match(/(then|and) i grew up/gi) ||
    lowerMessage.match(/but now/gi) ||
    lowerMessage.match(/these days/gi)
  ) {
    analysis.shouldCreateMemory = true;
    analysis.category = "personal";
    analysis.importance = 7;
    analysis.tags.push("growth", "life-changes", "personal-development");
  }

  // Emotional context detection
  if (lowerMessage.includes("loved") || lowerMessage.includes("love")) {
    analysis.emotionalContext = "nostalgic";
  } else if (
    lowerMessage.includes("hate") ||
    lowerMessage.includes("dislike")
  ) {
    analysis.emotionalContext = "negative";
  } else if (
    lowerMessage.includes("excited") ||
    lowerMessage.includes("happy")
  ) {
    analysis.emotionalContext = "positive";
  }

  // Set content if memory should be created
  if (analysis.shouldCreateMemory) {
    analysis.content = originalMessage;

    // Remove duplicates from tags
    analysis.tags = [...new Set(analysis.tags)];

    // Increase importance for very personal information
    if (
      analysis.tags.includes("childhood") ||
      analysis.tags.includes("family") ||
      analysis.tags.includes("personal-history")
    ) {
      analysis.importance = Math.min(10, analysis.importance + 1);
    }
  }

  return analysis;
}

/**
 * Creates a memory in the database based on the analysis
 */
export async function createMemoryFromMessage(
  messageContent: string,
  userId: mongoose.Types.ObjectId,
  companionId: mongoose.Types.ObjectId,
  _messageId?: mongoose.Types.ObjectId
): Promise<void> {
  const analysis = analyzeMessageForMemory(messageContent);

  if (!analysis.shouldCreateMemory) {
    return;
  }

  try {
    await SimplifiedMemory.create({
      userId,
      companionId,
      content: analysis.content,
      tags: analysis.tags,
      importance: analysis.importance,
      emotionalContext: analysis.emotionalContext,
      userCreated: false, // AI-generated memory
      isVisible: true,
    });

    console.log(
      `✅ Created memory: "${analysis.content.substring(
        0,
        50
      )}..." (Importance: ${analysis.importance})`
    );
  } catch (error) {
    console.error("❌ Error creating memory:", error);
  }
}
