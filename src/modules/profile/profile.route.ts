import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums.js";

import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

import { ProfileController } from "./profile.controller.js";
import { ProfileValidation } from "./profile.validation.js";

const router = Router();

router.get(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.PROVIDER,
    UserRole.CUSTOMER
  ),
  ProfileController.getMyProfile
);

router.patch(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.PROVIDER,
    UserRole.CUSTOMER
  ),
  validateRequest(
    ProfileValidation.updateProfileValidationSchema
  ),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;