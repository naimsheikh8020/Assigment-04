import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";



const router = Router();

router.post(
  "/init",
  auth(UserRole.CUSTOMER),
  validateRequest(
    PaymentValidation.createPaymentValidationSchema
  ),
  PaymentController.initiatePayment
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