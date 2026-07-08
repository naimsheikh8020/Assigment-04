import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums";

import { auth } from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";

import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

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