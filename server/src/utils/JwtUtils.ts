import jwt from "jsonwebtoken";
import logger from "./logger.js";

const generateJWTToken = (_id: string): string => {
  logger.debug("Inside GenerateJWTToken function");
  return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export { generateJWTToken };
