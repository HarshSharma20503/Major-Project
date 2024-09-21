import { Router, Request, Response, NextFunction } from "express";
import { createSubscription } from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, (req: Request, res: Response, next: NextFunction) => {
    createSubscription(req, res, next);
  });

export default router;
