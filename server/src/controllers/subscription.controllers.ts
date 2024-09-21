import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHanlder.js";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types.js";

export const createSubscription = AsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    console.log("******** Inside the createSubscription controller ********");
    const { token } = req.body;
    const id = req.user._id;
    if (!token) {
      throw new ApiError(400, "Token is required");
    }

    // Check if the user already has a subscription, if so, update the token else create a new subscription
    const subscription = await Subscription.findOneAndUpdate(
      { user: id },
      { token },
      { upsert: true, new: true }
    );
    res.status(201).json(new ApiResponse(201, subscription));
  }
);
