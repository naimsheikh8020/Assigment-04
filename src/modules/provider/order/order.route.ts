import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import { UserRole } from "../../../../generated/prisma/enums";
import { auth } from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";

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