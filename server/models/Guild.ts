import mongoose, { Schema, Document } from 'mongoose';

export interface IGuildMember {
  characterId: mongoose.Types.ObjectId;
  rank: 'member' | 'officer' | 'leader';
  joinedAt: Date;
  contributionPoints: number;
}

export interface IGuild extends Document {
  name: string;
  tag: string;
  description: string;
  level: number;
  experience: number;
  members: IGuildMember[];
  maxMembers: number;
  treasury: number;
  ranks: {
    name: string;
    permissions: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const GuildSchema = new Schema<IGuild>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    maxlength: 5,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 50,
  },
  experience: {
    type: Number,
    default: 0,
  },
  members: [{
    characterId: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
    },
    rank: {
      type: String,
      enum: ['member', 'officer', 'leader'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    contributionPoints: {
      type: Number,
      default: 0,
    },
  }],
  maxMembers: {
    type: Number,
    default: 50,
  },
  treasury: {
    type: Number,
    default: 0,
  },
  ranks: [{
    name: String,
    permissions: [String],
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IGuild>('Guild', GuildSchema);
