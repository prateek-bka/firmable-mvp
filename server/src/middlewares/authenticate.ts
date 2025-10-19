import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(createHttpError(401, "Access token not found!"));
  }

  try {
    if (!config.jwtSecret) {
      return next(
        createHttpError(500, "JWT configuration is missing!"),
      );
    }

    const decoded = jwt.verify(accessToken, config.jwtSecret) as {
      sub: string;
    };

    (req as AuthRequest).userId = decoded.sub;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token!"));
  }
};

