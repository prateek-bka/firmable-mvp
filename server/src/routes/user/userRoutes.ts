import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../../controllers/user/userController.js";
import userValidator from "../../validators/userRegisterValidator.js";
import userLoginValidator from "../../validators/userLoginValidator.js";

export const userRouter = Router();

userRouter.post("/register", userValidator, registerController);

userRouter.post("/login", userLoginValidator, loginController);

userRouter.post("/refresh", refreshTokenController);

userRouter.post("/logout", logoutController);
