import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { RentalService } from "./rental.service";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.createRental(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Rental order created successfully",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalService.getMyRentals(
    req.user.userId,
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getRentalDetails = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await RentalService.getRentalDetails(
      req.user.userId,
      id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Rental details retrieved successfully",
      data: result,
    });
  }
);

export const RentalController = {
  createRental,
  getMyRentals,
  getRentalDetails,
};