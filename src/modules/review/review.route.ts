import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = Router();

// Create Review
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(
    ReviewValidation.createReviewValidationSchema,
  ),
  ReviewController.createReview,
);

// Get Reviews by Gear
router.get(
  "/gear/:gearItemId",
  ReviewController.getGearReviews,
);

// Update Review
router.patch(
  "/:id",
  auth(UserRole.CUSTOMER),
  validateRequest(
    ReviewValidation.updateReviewValidationSchema,
  ),
  ReviewController.updateReview,
);

// Delete Review
router.delete(
  "/:id",
  auth(UserRole.CUSTOMER),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;