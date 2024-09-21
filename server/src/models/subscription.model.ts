import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Subscription

interface ISubscription extends Document {
  user: Schema.Types.ObjectId;
  token: string;
}

// Define the schema for Subscription

const subscriptionSchema = new Schema<ISubscription>(
  {
    // set user to be unique
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define and export the Subscription model

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
