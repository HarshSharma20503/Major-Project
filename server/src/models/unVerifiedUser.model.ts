import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for UnverifiedUser
interface IUnverifiedUser extends Document {
  name: string;
  email: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Define the schema for UnverifiedUser
const unverifiedUserSchema = new Schema<IUnverifiedUser>(
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
  },
  { timestamps: true }
);

// Method to match password
unverifiedUserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash the password
unverifiedUserSchema.pre<IUnverifiedUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

// Define and export the UnverifiedUser model
export const UnverifiedUser: Model<IUnverifiedUser> =
  mongoose.model<IUnverifiedUser>("UnverifiedUser", unverifiedUserSchema);
