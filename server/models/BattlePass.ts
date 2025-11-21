import mongoose, { Schema, Document } from 'mongoose';

export interface IBattlePassTier {
  tier: number;
  requiredXP: number;
  rewards: {
    free: {
      type: 'item' | 'gold' | 'cosmetic';
      itemId?: mongoose.Types.ObjectId;
      amount?: number;
    }[];
    premium: {
      type: 'item' | 'gold' | 'cosmetic';
      itemId?: mongoose.Types.ObjectId;
      amount?: number;
    }[];
  };
}

export interface IUserBattlePass extends Document {
  userId: mongoose.Types.ObjectId;
  season: number;
  currentTier: number;
  currentXP: number;
  isPremium: boolean;
  claimedRewards: {
    tier: number;
    type: 'free' | 'premium';
    claimedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BattlePassTierSchema = new Schema<IBattlePassTier>({
  tier: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  requiredXP: {
    type: Number,
    required: true,
  },
  rewards: {
    free: [{
      type: {
        type: String,
        enum: ['item', 'gold', 'cosmetic'],
      },
      itemId: Schema.Types.ObjectId,
      amount: Number,
    }],
    premium: [{
      type: {
        type: String,
        enum: ['item', 'gold', 'cosmetic'],
      },
      itemId: Schema.Types.ObjectId,
      amount: Number,
    }],
  },
});

const UserBattlePassSchema = new Schema<IUserBattlePass>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  season: {
    type: Number,
    required: true,
  },
  currentTier: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  currentXP: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  claimedRewards: [{
    tier: Number,
    type: {
      type: String,
      enum: ['free', 'premium'],
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export const BattlePassTier = mongoose.model<IBattlePassTier>('BattlePassTier', BattlePassTierSchema);
export const UserBattlePass = mongoose.model<IUserBattlePass>('UserBattlePass', UserBattlePassSchema);
