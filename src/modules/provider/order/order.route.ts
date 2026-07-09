import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { OrderValidation } from "./order.validation.js";
import { UserRole } from "../../../../generated/prisma/enums.js";
import { auth } from "../../../middlewares/auth.js";
import { validateRequest } from "../../../middlewares/validateRequest.js";

const router = Router();

router.get(
  "/",
  auth(UserRole.PROVIDER),
  OrderController.getProviderOrders
);

router.patch(
  "/:id",
  auth(UserRole.PROVIDER),
  validateRequest(
    OrderValidation.updateOrderStatusValidationSchema
  ),
  OrderController.updateOrderStatus
);

export const OrderRoutes = router;