import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ISchool extends Document {
  name: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const schoolSchema = new Schema<ISchool>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/ // Indian pincode validation
  },
  principalName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  contactPhone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // Indian mobile number validation
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
schoolSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
schoolSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const School = mongoose.model<ISchool>('School', schoolSchema);
