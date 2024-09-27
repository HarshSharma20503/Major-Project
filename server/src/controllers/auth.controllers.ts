import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

import { AsyncHandler } from "../utils/AsyncHanlder.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UnverifiedUser } from "../models/unVerifiedUser.model.js";
import { generateJWTToken } from "../utils/JwtUtils.js";
import { sendConfirmationMail } from "../utils/SendMail.js";
import logger from "../utils/logger.js";

interface AuthenticatedRequest extends Request {
  user?: typeof User & { _id: string };
}

/* 
/api/auth/signUp
Post Request
*/
const registerUser = AsyncHandler(async (req: Request, res: Response) => {
  console.log("******** registerUser Function ********");
  const { name, email, password } = req.body;
  console.log("User details", name, email, password);
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  console.log("Existing User", existingUser);
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const existingUnverifiedUser = await UnverifiedUser.findOne({ email });
  console.log("Existing Unverified User", existingUnverifiedUser);
  if (existingUnverifiedUser) {
    throw new ApiError(
      400,
      "Already registered. Please verify your email, check your mail to do so."
    );
  }

  const unverifiedUser = await UnverifiedUser.create({
    name,
    email,
    password,
  });

  if (!unverifiedUser) {
    throw new ApiError(500, "Failed to create User");
  }

  const confirmationMail = await sendConfirmationMail(
    email,
    unverifiedUser._id as string
  );

  if (!confirmationMail) {
    await UnverifiedUser.deleteOne({ _id: unverifiedUser._id });
    throw new ApiError(500, "Failed to send confirmation mail");
  }

  return res.json(
    new ApiResponse(
      200,
      {
        name: unverifiedUser.name,
        email: unverifiedUser.email,
      },
      "Please verify your email to continue"
    )
  );
});

/*
/api/auth/confirmEmail
Get Request
*/
const confirmEmail = AsyncHandler(async (req: Request, res: Response) => {
  console.log("******** confirmEmail Function ********");
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Invalid request");
  }

  const unverifiedUser = await UnverifiedUser.findById(id);
  if (!unverifiedUser) {
    throw new ApiError(404, "User not found");
  }

  console.log("Unverified User Password", unverifiedUser.password);

  const user = await User.create({
    name: unverifiedUser.name,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
  });

  console.log("Verified User", user.password);

  if (!user) {
    throw new ApiError(500, "Failed to create User");
  }

  await UnverifiedUser.deleteOne({ _id: unverifiedUser._id });

  const confirmedEmailHtml = fs.readFileSync(
    path.join(
      path.resolve(),
      "./src/templates/confirmedEmailPage.template.html"
    )
  );

  return res.status(200).send("" + confirmedEmailHtml);
});

/*
/api/auth/login
Post Request
*/
const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  console.log("******** loginUser Function ********");
  logger.debug("Inside the loginUser Function");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  console.log("User details", email, password);

  const user = await User.findOne({ email });

  console.log("User : ", user);
  if (!user) throw new ApiError(400, "User not found");

  const jwtToken = generateJWTToken(user._id as string);

  console.log("JWT Token : ", jwtToken);
  const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const checkPassword = await user.matchPassword(password);
  console.log("Check Password : ", checkPassword);

  if (user && (await user.matchPassword(password))) {
    console.log("Inside match password");
    return res
      .status(200)
      .cookie("accessToken", jwtToken, {
        httpOnly: true,
        expires: expiryDate,
        secure: false,
      })
      .json(
        new ApiResponse(
          200,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: jwtToken,
          },
          "User logged in successfully"
        )
      );
  }
  throw new ApiError(401, "Invalid email or password");
});

const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
  console.log("******** logoutUser Function ********");
  return res
    .status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, confirmEmail, loginUser, logoutUser };
