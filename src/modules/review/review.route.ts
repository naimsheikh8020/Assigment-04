import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums.js";

import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

import { ReviewController } from "./review.controller.js";
import { ReviewValidation } from "./review.validation.js";

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