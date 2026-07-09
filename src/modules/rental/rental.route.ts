import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums.js";

import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

import { RentalController } from "./rental.controller.js";
import { RentalValidation } from "./rental.validation.js";

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