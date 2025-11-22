import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  class: string;
  level: number;
  experience: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  vigor: number;
  wisdom: number;
  strength: number;
  intelligence: number;
  agility: number;
  luck: number;
  pa: number;
  maxPa: number;
  pm: number;
  maxPm: number;
  stealth: number;
  defense: number;
  dodge: number;
  magicResistance: number;
  meleeResistance: number;
  rangedResistance: number;
  moveSpeed: number;
  elementalResistance: Map<string, number>;
  position: {
    x: number;
    z: number;
    mapId: string;
  };
  rebirthCount: number;
  color: string;
  isAlive: boolean;
  inventory: mongoose.Types.ObjectId[];
  equippedArtifacts: {
    weapon?: mongoose.Types.ObjectId;
    armor?: mongoose.Types.ObjectId;
    helmet?: mongoose.Types.ObjectId;
    gloves?: mongoose.Types.ObjectId;
    boots?: mongoose.Types.ObjectId;
    accessory?: mongoose.Types.ObjectId;
  };
  companion?: {
    type: 'familiar' | 'mount';
    companionId: mongoose.Types.ObjectId;
  };
  guildId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
    enum: ['WARRIOR', 'PALADIN', 'ARCHER', 'SORCERER', 'CLERIC', 'THIEF', 'ASSASSIN'],
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  experience: {
    type: Number,
    default: 0,
  },
  hp: Number,
  maxHp: Number,
  mana: Number,
  maxMana: Number,
  vigor: Number,
  wisdom: Number,
  strength: Number,
  intelligence: Number,
  agility: Number,
  luck: Number,
  pa: Number,
  maxPa: Number,
  pm: Number,
  maxPm: Number,
  stealth: Number,
  defense: Number,
  dodge: Number,
  magicResistance: Number,
  meleeResistance: Number,
  rangedResistance: Number,
  moveSpeed: Number,
  elementalResistance: {
    type: Map,
    of: Number,
    default: {},
  },
  position: {
    x: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    mapId: { type: String, default: 'starter_map' },
  },
  rebirthCount: {
    type: Number,
    default: 0,
  },
  color: String,
  isAlive: {
    type: Boolean,
    default: true,
  },
  inventory: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }],
  equippedArtifacts: {
    weapon: { type: Schema.Types.ObjectId, ref: 'Item' },
    armor: { type: Schema.Types.ObjectId, ref: 'Item' },
    helmet: { type: Schema.Types.ObjectId, ref: 'Item' },
    gloves: { type: Schema.Types.ObjectId, ref: 'Item' },
    boots: { type: Schema.Types.ObjectId, ref: 'Item' },
    accessory: { type: Schema.Types.ObjectId, ref: 'Item' },
  },
  companion: {
    type: {
      type: String,
      enum: ['familiar', 'mount'],
    },
    companionId: Schema.Types.ObjectId,
  },
  guildId: {
    type: Schema.Types.ObjectId,
    ref: 'Guild',
  },
}, {
  timestamps: true,
});

export default mongoose.model<ICharacter>('Character', CharacterSchema);
