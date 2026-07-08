import { Router } from "express";

import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

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