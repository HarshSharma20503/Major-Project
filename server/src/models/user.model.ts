import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs"; // Changed to bcryptjs

// Define interfaces for sub-schemas
interface ICompany {
  name: string;
  quantity: number;
}

interface INotification {
  name: string;
  priorityLevel: number;
  url: string;
}

// Define interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  companies: ICompany[];
  notifications: INotification[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Define Company schema
const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1, // Default quantity is 1
  },
});

// Define Notification schema
const notificationSchema = new Schema<INotification>({
  name: {
    type: String,
    required: true,
  },
  priorityLevel: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Define User schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    companies: [companySchema],
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

// Method to match password
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const temp = await bcrypt.hash(enteredPassword, 12);
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware for hashing password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

// Define and export User model
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
