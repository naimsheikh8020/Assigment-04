import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums";

import { auth } from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";

import { RentalController } from "./rental.controller";
import { RentalValidation } from "./rental.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(
    RentalValidation.getAllRentalValidationSchema
  ),
  RentalController.getAllRentals
);

export const AdminRentalRoutes = router;