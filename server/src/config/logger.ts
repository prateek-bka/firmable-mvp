import winston from "winston";
import { config } from "./config.js";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { serviceName: "backend" },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: config.NODE_ENV === "test",
    }),

    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

export default logger;
