import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

import { CategoryController } from "./category.controller.js";
import { CategoryValidation } from "./category.validation.js";

const router = Router();

// Public Routes
router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getSingleCategory);

// Admin Routes
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;