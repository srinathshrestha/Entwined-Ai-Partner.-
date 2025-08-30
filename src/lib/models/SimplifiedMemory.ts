import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISimplifiedMemory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Owner of memory
  companionId: mongoose.Types.ObjectId; // Which companion this memory relates to
  content: string; // The actual memory content

  // User-defined organization
  tags: string[]; // User-defined tags for easy retrieval
  importance: number; // 1-10 importance scale

  // Context
  emotionalContext?: string; // Emotional state when memory formed

  // Timestamps
  createdAt: Date;
  lastAccessed?: Date; // When last used in response

  // Control
  userCreated: boolean; // AI vs user created
  isVisible: boolean; // User can see this memory
}

const SimplifiedMemorySchema = new Schema<ISimplifiedMemory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companionId: {
      type: Schema.Types.ObjectId,
      ref: "Companion",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    // User-defined organization
    tags: {
      type: [String],
      default: [],
    },
    importance: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },

    // Context
    emotionalContext: String,

    // Timestamps
    lastAccessed: Date,

    // Control
    userCreated: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SimplifiedMemorySchema.index({ userId: 1, companionId: 1 });
SimplifiedMemorySchema.index({ userId: 1, importance: -1 });
SimplifiedMemorySchema.index({ userId: 1, createdAt: -1 });
SimplifiedMemorySchema.index({ tags: 1 });

export const SimplifiedMemory: Model<ISimplifiedMemory> =
  mongoose.models.SimplifiedMemory ||
  mongoose.model<ISimplifiedMemory>("SimplifiedMemory", SimplifiedMemorySchema);
