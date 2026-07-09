import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import { PaymentService } from "./payment.service.js";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(
    req.user.userId,
    req.body.rentalOrderId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const { rentalOrderId, transactionId } = req.query;

  await PaymentService.successPayment(
    rentalOrderId as string,
    transactionId as string,
    req.body,
  );

  res.send(`
<h1>Payment Successful </h1>
<p>Your payment has been completed.</p>
`);
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.query;

  await PaymentService.failPayment(transactionId as string);

  res.send(`
      <h1>Payment Failed </h1>
      <p>Your payment has failed.</p>
    `);
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.query;

  await PaymentService.cancelPayment(transactionId as string);

  res.send(`
     <h1>Payment Cancelled </h1>
     <p>Your payment has been cancelled.</p>
   `);
});

const getPaymentHistory = catchAsync(async (req, res) => {
  const customerId = req.user.userId;

  const result = await PaymentService.getPaymentHistory(
    customerId,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment history retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PaymentController = {
  initiatePayment,
  successPayment,
  failPayment,
  cancelPayment,
  getPaymentHistory
};
