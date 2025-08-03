import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStudent extends Document {
  name: string;
  password: string;
  schoolId: mongoose.Types.ObjectId;
  class: string;
  section: string;
  gender: string;
  rollNo: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  class: {
    type: String,
    required: true,
    enum: ['6', '7', '8', '9', '10', '11', '12']
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E'],
    uppercase: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
    lowercase: true
  },
  rollNo: {
    type: String,
    required: true,
    trim: true
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compound unique index: student name must be unique within a school
studentSchema.index({ name: 1, schoolId: 1 }, { unique: true });

// Compound unique index: roll number must be unique within a school and class
studentSchema.index({ rollNo: 1, schoolId: 1, class: 1 }, { unique: true });

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Student = mongoose.model<IStudent>('Student', studentSchema);
