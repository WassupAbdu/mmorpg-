import mongoose, { Schema, Document } from 'mongoose';

export interface IQuest extends Document {
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'story' | 'guild';
  npcGiver?: string;
  requirements: {
    level?: number;
    questsCompleted?: string[];
  };
  objectives: {
    type: 'kill' | 'collect' | 'interact' | 'reach';
    target: string;
    current: number;
    required: number;
  }[];
  rewards: {
    experience: number;
    gold?: number;
    items?: mongoose.Types.ObjectId[];
    battlePassXP?: number;
  };
  isRepeatable: boolean;
  resetTime?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

const QuestSchema = new Schema<IQuest>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'story', 'guild'],
    required: true,
  },
  npcGiver: String,
  requirements: {
    level: Number,
    questsCompleted: [String],
  },
  objectives: [{
    type: {
      type: String,
      enum: ['kill', 'collect', 'interact', 'reach'],
    },
    target: String,
    current: {
      type: Number,
      default: 0,
    },
    required: Number,
  }],
  rewards: {
    experience: Number,
    gold: Number,
    items: [{
      type: Schema.Types.ObjectId,
      ref: 'Item',
    }],
    battlePassXP: Number,
  },
  isRepeatable: {
    type: Boolean,
    default: false,
  },
  resetTime: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
  },
}, {
  timestamps: true,
});

export default mongoose.model<IQuest>('Quest', QuestSchema);
