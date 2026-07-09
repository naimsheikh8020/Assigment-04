import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums";

import { auth } from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";

import { GearController } from "./gear.controller";
import { GearValidation } from "./gear.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(
    GearValidation.getAllGearValidationSchema,
  ),
  GearController.getAllGear,
);

export const AdminGearRoutes = router;