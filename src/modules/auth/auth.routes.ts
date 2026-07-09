import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.get(
  "/me",
  auth(),
  AuthController.getMe
);

export const AuthRoutes = router;