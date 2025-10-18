import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { userModel, type UserDocument } from "../../models/user/userModel.js";
import { config } from "../../config/config.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result
      .array()
      .map((err) => err.msg)
      .join(", ");
    const error = createHttpError(400, errors);
    return next(error);
  }

  const { email, password } = req.body;

  // Find User
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      const error = createHttpError(
        400,
        `User already exists with this email. Try Login!`,
      );

      return next(error);
    }
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Error while getting the user! ${(error as Error).message}`,
      ),
    );
  }

  // Hash Password
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  // User creation
  let newUser: UserDocument;

  try {
    newUser = await userModel.create({ email, password: hashPassword });

    res.status(201).json({
      success: true,
      message: `${newUser.email} registered successfully!`,
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Error while creating user! ${(error as Error).message}`,
      ),
    );
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result
      .array()
      .map((err) => err.msg)
      .join(", ");
    const error = createHttpError(400, errors);
    return next(error);
  }

  const { email, password } = req.body;

  // Check user
  let userExists: UserDocument | null;

  try {
    userExists = await userModel.findOne({ email });
    if (!userExists) {
      return next(
        createHttpError(400, `User does not exist, Please register!`),
      );
    }
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Internal server error! ${(error as Error).message}`,
      ),
    );
  }

  // Check password
  try {
    const checkPassword = await bcrypt.compare(password, userExists.password);

    if (!checkPassword) {
      return next(createHttpError(400, `Username or password incorrect!`));
    }
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Internal server error! ${(error as Error).message}`,
      ),
    );
  }

  // Generate Access Token (short-lived)
  try {
    // Validate JWT secrets are configured
    if (!config.jwtSecret || !config.jwtRefreshSecret) {
      return next(
        createHttpError(
          500,
          "JWT configuration is missing! Please check environment variables.",
        ),
      );
    }

    const accessToken = jwt.sign(
      { sub: userExists._id, role: userExists.role },
      config.jwtSecret,
      {
        expiresIn: "15m", // 15 minutes
        algorithm: "HS256",
      },
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { sub: userExists._id },
      config.jwtRefreshSecret,
      {
        expiresIn: "7d", // 7 days
        algorithm: "HS256",
      },
    );

    // Save refresh token to database
    userExists.refreshToken = refreshToken;
    await userExists.save();

    // Set tokens as httpOnly cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        success: true,
        message: `${userExists.email} logged in successfully!`,
        user: {
          id: userExists._id,
          email: userExists.email,
          role: userExists.role,
        },
      });
  } catch (error) {
    return next(
      createHttpError(
        500,
        `Error generating token: ${(error as Error).message}`,
      ),
    );
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(createHttpError(401, "Refresh token not found!"));
  }

  try {
    // Validate JWT secrets are configured
    if (!config.jwtSecret || !config.jwtRefreshSecret) {
      return next(
        createHttpError(
          500,
          "JWT configuration is missing! Please check environment variables.",
        ),
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as {
      sub: string;
    };

    // Find user with this refresh token
    const user: UserDocument | null = await userModel.findOne({
      _id: decoded.sub,
      refreshToken,
    });

    if (!user) {
      return next(createHttpError(403, "Invalid refresh token!"));
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { sub: user._id, role: user.role },
      config.jwtSecret,
      {
        expiresIn: "15m",
        algorithm: "HS256",
      },
    );

    // Set new access token
    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Access token refreshed successfully!",
      });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        createHttpError(403, "Refresh token expired, please login again!"),
      );
    }
    return next(createHttpError(403, "Invalid refresh token!"));
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(createHttpError(400, "No active session found!"));
  }

  try {
    // Find user and remove refresh token
    const user: UserDocument | null = await userModel.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    // Clear cookies
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .clearCookie("session")
      .clearCookie("token")
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully!",
      });
  } catch (error) {
    return next(
      createHttpError(500, `Error during logout! ${(error as Error).message}`),
    );
  }
};
