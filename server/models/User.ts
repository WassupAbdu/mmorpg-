import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  provider: 'email' | 'google' | 'github';
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    },
  },
  displayName: {
    type: String,
    required: true,
  },
  photoURL: String,
  provider: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>('User', UserSchema);
