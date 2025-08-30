import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companionId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Conversation Metadata
  title?: string; // Auto-generated or user-defined
  isActive: boolean;
  lastActivity: Date;

  // Message Statistics
  messageCount: number;
  userMessages: number;
  aiMessages: number;
  deletedMessages: number;
  editedMessages: number;
}

const ConversationSchema = new Schema<IConversation>(
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

    // Conversation Metadata
    title: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },

    // Message Statistics
    messageCount: {
      type: Number,
      default: 0,
    },
    userMessages: {
      type: Number,
      default: 0,
    },
    aiMessages: {
      type: Number,
      default: 0,
    },
    deletedMessages: {
      type: Number,
      default: 0,
    },
    editedMessages: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ConversationSchema.index({ userId: 1, isActive: 1 });
ConversationSchema.index({ companionId: 1 });
ConversationSchema.index({ lastActivity: -1 });

// Static method to get or create active conversation
ConversationSchema.statics.getOrCreateActive = async function (
  userId: mongoose.Types.ObjectId,
  companionId: mongoose.Types.ObjectId
): Promise<IConversation> {
  let conversation = await this.findOne({
    userId,
    companionId,
    isActive: true,
  });

  if (!conversation) {
    conversation = await this.create({
      userId,
      companionId,
      title: "New Conversation",
      isActive: true,
      lastActivity: new Date(),
      messageCount: 0,
      userMessages: 0,
      aiMessages: 0,
      deletedMessages: 0,
      editedMessages: 0,
    });
  }

  return conversation;
};

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
