import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums.js";

import { auth } from "../../../middlewares/auth.js";
import { validateRequest } from "../../../middlewares/validateRequest.js";

import { UserController } from "./user.controller.js";
import { UserValidation } from "./user.validation.js";

const router = Router();

// Get all users
router.get(
  "/",
  auth(UserRole.ADMIN),
  UserController.getAllUsers
);

// Get single user
router.get(
  "/:id",
  auth(UserRole.ADMIN),
  UserController.getSingleUser
);

// Update user status (ACTIVE/SUSPENDED)
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(
    UserValidation.updateUserStatusValidationSchema
  ),
  UserController.updateUserStatus
);

export const UserRoutes = router;