import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums.js";

import { auth } from "../../../middlewares/auth.js";
import { validateRequest } from "../../../middlewares/validateRequest.js";

import { GearController } from "./gear.controller.js";
import { GearValidation } from "./gear.validation.js";

const router = Router();

router.post(
  "/",
  auth(UserRole.PROVIDER),
  validateRequest(GearValidation.createGearValidationSchema),
  GearController.createGear
);

router.patch(
  "/:id",
  auth(UserRole.PROVIDER),
  validateRequest(GearValidation.updateGearValidationSchema),
  GearController.updateGear
);

router.delete(
  "/:id",
  auth(UserRole.PROVIDER),
  GearController.deleteGear
);

export const GearRoutes = router;