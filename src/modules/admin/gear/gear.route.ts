import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums.js";

import { auth } from "../../../middlewares/auth.js";
import { validateRequest } from "../../../middlewares/validateRequest.js";

import { GearController } from "./gear.controller.js";
import { GearValidation } from "./gear.validation.js";

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