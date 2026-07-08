import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";

import { auth } from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";

import { GearController } from "./gear.controller";
import { GearValidation } from "./gear.validation";

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