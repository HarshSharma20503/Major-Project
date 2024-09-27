import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types.js";
import logger from "./logger.js";

const AsyncHandler = (
  fn: (
    req: Request | AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      logger.error(error.message);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
};

export { AsyncHandler };
