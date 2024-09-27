import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file"; // For rotating logs
import path from "path";

const { combine, timestamp, json, printf, colorize, errors } = format;

const env = process.env.NODE_ENV || "development";

// Custom formats
const consoleLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }), // Print stack trace for errors
  consoleLogFormat
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }), // Handle stack traces
  json()
);

// Create logger
const logger = createLogger({
  level: env === "development" ? "debug" : "info", // More verbose in development
  format: env === "development" ? devFormat : prodFormat,
  transports: [
    // Console transport for dev and prod
    new transports.Console(),

    // File transport with daily rotation
    new transports.DailyRotateFile({
      dirname: path.join(path.resolve(), "logs"), // Logs directory
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d", // Keep logs for 14 days
      level: "info", // Log 'info' level and above to file
    }),
  ],
});

export default logger;
