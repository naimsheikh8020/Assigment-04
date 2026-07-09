import { Router } from "express";

import { UserRole } from "../../../../generated/prisma/enums.js";

import { auth } from "../../../middlewares/auth.js";
import { validateRequest } from "../../../middlewares/validateRequest.js";

import { RentalController } from "./rental.controller.js";
import { RentalValidation } from "./rental.validation.js";

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