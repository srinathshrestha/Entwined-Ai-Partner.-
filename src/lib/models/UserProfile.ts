import mongoose, { Schema, Document, Model } from "mongoose";

interface IUserProfileModel extends Model<IUserProfile> {
  getOrCreate(userId: string): Promise<IUserProfile>;
}

export interface IUserProfile extends Document {
  userId: string;
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  onboardingCompletedAt?: Date;
  preferredName?: string;
  timezone?: string;
  language: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    autoSaveMemories: boolean;
    memoryImportanceThreshold: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingSkipped: {
      type: Boolean,
      default: false,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
    preferredName: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    language: {
      type: String,
      default: "en",
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      autoSaveMemories: {
        type: Boolean,
        default: true,
      },
      memoryImportanceThreshold: {
        type: Number,
        default: 5,
        min: 1,
        max: 10,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster lookups
UserProfileSchema.index({ userId: 1 });

// Static method to get or create profile
UserProfileSchema.statics.getOrCreate = async function (
  userId: string
): Promise<IUserProfile> {
  let profile = await this.findOne({ userId });

  if (!profile) {
    profile = await this.create({ userId });
  }

  return profile;
};

const UserProfile = (mongoose.models.UserProfile ||
  mongoose.model<IUserProfile, IUserProfileModel>(
    "UserProfile",
    UserProfileSchema
  )) as IUserProfileModel;
export default UserProfile;
