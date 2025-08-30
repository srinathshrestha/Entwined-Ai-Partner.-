import mongoose, { Schema, Document, Model } from "mongoose";

export enum MessageRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

export enum DeletedBy {
  USER = "USER",
  SYSTEM = "SYSTEM",
}

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Message Content
  content: string;
  role: MessageRole;

  // Reply System
  replyToId?: mongoose.Types.ObjectId;
  hasReplies: boolean;
  replyDepth: number; // For nested reply threading

  // Edit System
  isEdited: boolean;
  editCount: number;
  editHistory?: any; // Array of {content, editedAt}
  originalContent?: string; // Store original content

  // Delete System (independent of memories)
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: DeletedBy; // USER or SYSTEM
  deleteReason?: string; // Reason for deletion

  // Memory Association Tracking (for debugging, not functionality)
  memoryGenerated: boolean; // Whether this message generated memories
  memoryCount: number; // How many memories generated

  // Message Metadata
  wordCount?: number; // For analytics
  characterCount?: number; // For analytics
  sentiment?: string; // positive, negative, neutral
  isImportant: boolean; // User can mark important
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // Message Content
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(MessageRole),
      required: true,
    },

    // Reply System
    replyToId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    hasReplies: {
      type: Boolean,
      default: false,
    },
    replyDepth: {
      type: Number,
      default: 0,
    },

    // Edit System
    isEdited: {
      type: Boolean,
      default: false,
    },
    editCount: {
      type: Number,
      default: 0,
    },
    editHistory: Schema.Types.Mixed,
    originalContent: String,

    // Delete System
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: {
      type: String,
      enum: Object.values(DeletedBy),
    },
    deleteReason: String,

    // Memory Association Tracking
    memoryGenerated: {
      type: Boolean,
      default: false,
    },
    memoryCount: {
      type: Number,
      default: 0,
    },

    // Message Metadata
    wordCount: Number,
    characterCount: Number,
    sentiment: String,
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, isDeleted: 1 });
MessageSchema.index({ replyToId: 1 });

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
