import mongoose, { Schema, Document, Model } from "mongoose";

interface IMemoryModel extends Model<IMemory> {
  createAutoMemory(
    userId: mongoose.Types.ObjectId,
    companionId: mongoose.Types.ObjectId,
    conversationId: mongoose.Types.ObjectId,
    content: string,
    importance: number,
    category: string,
    messageId?: mongoose.Types.ObjectId
  ): Promise<IMemory>;
}

export interface IMemory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companionId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  content: string;
  importance: number; // 1-10 scale
  tags: string[];
  type: "auto" | "manual" | "system";
  status: "active" | "archived" | "deleted";
  messageId?: mongoose.Types.ObjectId; // Reference to the message that created this memory

  // Memory categorization
  category:
    | "personal"
    | "preference"
    | "relationship"
    | "experience"
    | "knowledge"
    | "emotion";

  // Memory context and metadata
  context: {
    conversationTopic?: string;
    emotionalTone?: string;
    timeContext?: string;
    location?: string;
  };

  // Memory relationships
  relatedMemories: mongoose.Types.ObjectId[];

  // Memory access tracking
  accessCount: number;
  lastAccessedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>(
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
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    importance: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    tags: [String],
    type: {
      type: String,
      enum: ["auto", "manual", "system"],
      default: "auto",
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    category: {
      type: String,
      enum: [
        "personal",
        "preference",
        "relationship",
        "experience",
        "knowledge",
        "emotion",
      ],
      default: "experience",
    },
    context: {
      conversationTopic: String,
      emotionalTone: String,
      timeContext: String,
      location: String,
    },
    relatedMemories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
    accessCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
MemorySchema.index({ userId: 1, status: 1 });
MemorySchema.index({ companionId: 1, status: 1 });
MemorySchema.index({ conversationId: 1 });
MemorySchema.index({ importance: -1 });
MemorySchema.index({ tags: 1 });
MemorySchema.index({ category: 1 });
MemorySchema.index({ createdAt: -1 });
MemorySchema.index({ lastAccessedAt: -1 });

// Static method to create auto-generated memory
MemorySchema.statics.createAutoMemory = async function (
  userId: mongoose.Types.ObjectId,
  companionId: mongoose.Types.ObjectId,
  conversationId: mongoose.Types.ObjectId,
  content: string,
  importance: number,
  category: string,
  messageId?: mongoose.Types.ObjectId
): Promise<IMemory> {
  const memory = await this.create({
    userId,
    companionId,
    conversationId,
    content,
    importance,
    category,
    type: "auto",
    status: "active",
    messageId,
    accessCount: 0,
  });

  return memory;
};

// Method to access memory (increments access count)
MemorySchema.methods.access = async function (): Promise<void> {
  this.accessCount += 1;
  this.lastAccessedAt = new Date();
  await this.save();
};

export const Memory = (mongoose.models.Memory ||
  mongoose.model<IMemory, IMemoryModel>(
    "Memory",
    MemorySchema
  )) as IMemoryModel;
