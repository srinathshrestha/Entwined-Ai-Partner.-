import mongoose, { Schema, Document, Model } from "mongoose";

interface ICompanionModel extends Model<ICompanion> {
  createDefault(userId: mongoose.Types.ObjectId): Promise<ICompanion>;
  getOrCreateDefault(userId: mongoose.Types.ObjectId): Promise<ICompanion>;
}

export interface ICompanion extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  gender: "male" | "female" | "non-binary";

  // Simplified Personality System (1-10 scales)
  affectionLevel: number; // 1-10: How openly affectionate
  empathyLevel: number; // 1-10: How empathetic and understanding
  curiosityLevel: number; // 1-10: How curious and inquisitive
  playfulness: number; // 1-10: How playful and fun-loving

  // Style Preferences
  humorStyle: "playful" | "witty" | "gentle" | "sarcastic" | "serious";
  communicationStyle: "casual" | "formal" | "intimate" | "professional";

  // Interaction Preferences
  userPreferredAddress: string; // How to address the user
  partnerPronouns: string; // he/him, she/her, they/them, other

  // Avatar (simplified)
  avatarUrl?: string; // Optional avatar image

  // Character Background & Story
  backStory?: string; // Detailed character background, history, and personality narrative

  // Default companion flag
  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CompanionSchema = new Schema<ICompanion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
      required: true,
    },

    // Personality System
    affectionLevel: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    empathyLevel: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    curiosityLevel: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    playfulness: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },

    // Style Preferences
    humorStyle: {
      type: String,
      enum: ["playful", "witty", "gentle", "sarcastic", "serious"],
      default: "gentle",
    },
    communicationStyle: {
      type: String,
      enum: ["casual", "formal", "intimate", "professional"],
      default: "casual",
    },

    // Interaction Preferences
    userPreferredAddress: {
      type: String,
      default: "you",
    },
    partnerPronouns: {
      type: String,
      default: "they/them",
    },

    // Avatar
    avatarUrl: String,

    // Character Background
    backStory: String,

    // Default companion flag
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanionSchema.index({ userId: 1 });

// Static method to create default companion
CompanionSchema.statics.createDefault = async function (
  userId: mongoose.Types.ObjectId
): Promise<ICompanion> {
  const defaultCompanion = await this.create({
    userId,
    name: "Alex",
    gender: "non-binary",
    affectionLevel: 5,
    empathyLevel: 7,
    curiosityLevel: 6,
    playfulness: 5,
    humorStyle: "gentle",
    communicationStyle: "casual",
    userPreferredAddress: "you",
    partnerPronouns: "they/them",
    backStory:
      "I'm your AI companion, here to chat and help you with whatever you need. I'm curious about the world and love learning about you!",
    isDefault: true,
  });

  return defaultCompanion;
};

// Static method to get or create companion (creates default if none exists)
CompanionSchema.statics.getOrCreateDefault = async function (
  userId: mongoose.Types.ObjectId
): Promise<ICompanion> {
  let companion = await this.findOne({ userId });

  if (!companion) {
    companion = await this.createDefault(userId);
  }

  return companion;
};

export const Companion = (mongoose.models.Companion ||
  mongoose.model<ICompanion, ICompanionModel>(
    "Companion",
    CompanionSchema
  )) as ICompanionModel;
