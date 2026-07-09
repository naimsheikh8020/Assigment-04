import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { RentalController } from "./rental.controller";
import { RentalValidation } from "./rental.validation";

const router = Router();

// Create Rental
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(RentalValidation.createRentalValidationSchema),
  RentalController.createRental
);

// Get My Rentals
router.get(
  "/",
  auth(UserRole.CUSTOMER),
  RentalController.getMyRentals
);

// Get Rental Details
router.get(
  "/:id",
  auth(UserRole.CUSTOMER),
  RentalController.getRentalDetails
);

export const RentalRoutes = router;