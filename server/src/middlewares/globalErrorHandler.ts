import type { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config.js";
import logger from "../config/logger.js";
import { v4 as uuidv4 } from "uuid";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const errorId = uuidv4();

  logger.error({
    errorId,
    message: err.message,
    statusCode,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  return res.status(statusCode).json({
    message: err.message,
    errorId,
    errorStack: config.env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
