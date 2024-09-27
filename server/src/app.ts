import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import morgan from "morgan";

// Initialize the Express application
const app: Express = express();

// Configure CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "16kb" })); // to parse json in body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to parse url
app.use(express.static("public")); // to use static public folder
app.use(cookieParser()); // to enable CRUD operation on browser cookies

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Import and use auth routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth", authRouter);

// Import and use user routes
import userRouter from "./routes/user.routes.js";
app.use("/api/user", userRouter);

// Import and use subscription routes
import subscriptionRouter from "./routes/subscription.routes.js";
app.use("/api/subscription", subscriptionRouter);

export { app };
