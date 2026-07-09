import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { PaymentValidation } from "./payment.validation.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";



const router = Router();

router.post(
  "/init",
  auth(UserRole.CUSTOMER),
  validateRequest(
    PaymentValidation.createPaymentValidationSchema
  ),
  PaymentController.initiatePayment
);

router.get(
  "/my",
  auth(UserRole.CUSTOMER),
  PaymentController.getPaymentHistory,
);

router.post(
  "/success",
  PaymentController.successPayment
);

router.post(
  "/fail",
  PaymentController.failPayment
);

router.post(
  "/cancel",
  PaymentController.cancelPayment
);

export const PaymentRoutes = router;