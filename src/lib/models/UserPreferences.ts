import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserPreferences extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  // Chat Preferences
  enableTypingIndicators: boolean;
  enableNotifications: boolean;
  chatTheme: string; // light, dark, auto
  messageTimestamps: boolean;
  soundEffects: boolean;

  // Memory Preferences
  memoryRetentionDays: number; // Days to keep memories
  memoryImportanceThreshold: number; // Minimum importance to store
  autoMemoryDeletion: boolean; // Auto-delete old memories
  memoryPrivacyLevel: string; // strict, balanced, open

  // AI Behavior Settings
  responseStyle: string; // adaptive, consistent, varied
  responseLength: string; // short, medium, long, adaptive
  creativityLevel: number; // 0.0 to 1.0
  emotionalDepth: number; // How emotionally expressive
  memoryReference: string; // natural, frequent, minimal

  // Privacy & Safety
  dataRetentionDays: number; // How long to keep data
  allowDataExport: boolean;
  allowAnalytics: boolean;
  contentFiltering: string; // strict, moderate, minimal

  // Notification Preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Chat Preferences
    enableTypingIndicators: {
      type: Boolean,
      default: true,
    },
    enableNotifications: {
      type: Boolean,
      default: true,
    },
    chatTheme: {
      type: String,
      default: "default",
    },
    messageTimestamps: {
      type: Boolean,
      default: true,
    },
    soundEffects: {
      type: Boolean,
      default: false,
    },

    // Memory Preferences
    memoryRetentionDays: {
      type: Number,
      default: 365,
    },
    memoryImportanceThreshold: {
      type: Number,
      default: 3,
    },
    autoMemoryDeletion: {
      type: Boolean,
      default: false,
    },
    memoryPrivacyLevel: {
      type: String,
      default: "balanced",
    },

    // AI Behavior Settings
    responseStyle: {
      type: String,
      default: "adaptive",
    },
    responseLength: {
      type: String,
      default: "medium",
    },
    creativityLevel: {
      type: Number,
      default: 0.7,
    },
    emotionalDepth: {
      type: Number,
      default: 0.8,
    },
    memoryReference: {
      type: String,
      default: "natural",
    },

    // Privacy & Safety
    dataRetentionDays: {
      type: Number,
      default: 365,
    },
    allowDataExport: {
      type: Boolean,
      default: true,
    },
    allowAnalytics: {
      type: Boolean,
      default: true,
    },
    contentFiltering: {
      type: String,
      default: "moderate",
    },

    // Notification Preferences
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    reminderNotifications: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferences: Model<IUserPreferences> =
  mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>("UserPreferences", UserPreferencesSchema);
