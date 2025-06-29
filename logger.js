const winston = require("winston");
const path = require("path");

// Define log levels with custom colors
const customLogLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "grey",
  },
};

// Apply custom log levels and colors
winston.addColors(customLogLevels.colors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    // Include stack trace for error logs
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message} - ${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Environment-based transports
const transports = [
  // Console logging for development/debugging
  new winston.transports.Console({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple() // Simple format for better readability
    ),
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, "../logs/app.log"),
    level: "info", // Logs info and higher
    format: logFormat,
  }),

  // Separate error file for error logs
  new winston.transports.File({
    filename: path.join(__dirname, "../logs/error.log"),
    level: "error", // Logs only errors
    format: logFormat,
  }),
];

// Create the logger
const logger = winston.createLogger({
  levels: customLogLevels.levels,
  level: "info", // Default level (adjustable via environment variables)
  format: logFormat,
  transports: transports,
  exitOnError: false, // Prevent logger from exiting on exceptions
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(__dirname, "../logs/exceptions.log"),
  }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection: ", reason);
});

module.exports = logger;
