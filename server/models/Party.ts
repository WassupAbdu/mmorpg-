import mongoose, { Schema, Document } from 'mongoose';

export interface IPartyMember {
  characterId: mongoose.Types.ObjectId;
  role: 'leader' | 'member';
  joinedAt: Date;
}

export interface IParty extends Document {
  name: string;
  members: IPartyMember[];
  maxMembers: number;
  isPublic: boolean;
  currentDungeonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartySchema = new Schema<IParty>({
  name: String,
  members: [{
    characterId: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true,
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  maxMembers: {
    type: Number,
    default: 5,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  currentDungeonId: String,
}, {
  timestamps: true,
});

export default mongoose.model<IParty>('Party', PartySchema);
