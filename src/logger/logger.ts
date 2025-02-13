import winston from "winston";
import { v4 as uuidv4 } from "uuid";

// Format for the logs
const customFormat = winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
  return `${timestamp} [${context || "HTTP"}] ${level.toUpperCase()}: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ""
  }`;
});

// Define environment-specific configurations
const environmentConfigurations = {
  devConfig: {
    level: "debug",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: "logs/dev.log",
      }),
    ],
    generateRequestId: () => uuidv4(),
  },
  stagingConfig: {
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), customFormat),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: "logs/staging.log",
      }),
    ],
    generateRequestId: () => uuidv4(),
  },
  prodConfig: {
    level: "warn",
    format: winston.format.combine(winston.format.timestamp(), customFormat),
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: "logs/production.log",
      }),
    ],
    generateRequestId: () => uuidv4(),
  },
};

// Logger factory function
function createLoggerConfig(env: string) {
  const { devConfig, stagingConfig, prodConfig } = environmentConfigurations;

  const configs: any = {
    dev: devConfig,
    staging: stagingConfig,
    production: prodConfig,
  };

  const config = configs[env] || devConfig;
  return winston.createLogger(config);
}

// Middleware for attaching logger and request ID
function loggerMiddleware(logger: any) {
  return (req: any, res: any, next: any) => {
    req.id = uuidv4();
    req.logger = logger.child({
      context: "HTTP",
      id: req.id,
    });

    req.logger.info(`Incoming request: ${req.method} ${req.url}`);
    res.on("finish", () => {
      req.logger.info(`Response sent: ${res.statusCode}`);
    });

    next();
  };
}

// Export the logger and middleware
export default function setupLogger(env = process.env.NODE_ENV || "dev") {
  const logger = createLoggerConfig(env);
  return {
    logger,
    loggerMiddleware: loggerMiddleware(logger),
  };
}
