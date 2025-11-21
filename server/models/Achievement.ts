import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'exploration' | 'social' | 'progression' | 'collection';
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: {
    type: string;
    target: string;
    required: number;
  };
  rewards: {
    experience?: number;
    gold?: number;
    title?: string;
  };
  isSecret: boolean;
  createdAt: Date;
}

export interface IUserAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['combat', 'exploration', 'social', 'progression', 'collection'],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },
  criteria: {
    type: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    required: {
      type: Number,
      required: true,
    },
  },
  rewards: {
    experience: Number,
    gold: Number,
    title: String,
  },
  isSecret: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const UserAchievementSchema = new Schema<IUserAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievementId: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);
