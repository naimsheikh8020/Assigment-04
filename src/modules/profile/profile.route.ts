import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

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