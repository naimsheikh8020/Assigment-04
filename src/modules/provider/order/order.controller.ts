import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";

import { OrderService } from "./order.service.js";

const getProviderOrders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.getProviderOrders(
      req.user.userId,
      req.query
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  }
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.updateOrderStatus(
      req.user.userId,
      req.params.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  }
);

export const OrderController = {
  getProviderOrders,
  updateOrderStatus,
};