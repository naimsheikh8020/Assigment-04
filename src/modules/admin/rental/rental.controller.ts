import { StatusCodes } from "http-status-codes";


import { RentalService } from "./rental.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";

const getAllRentals = catchAsync(async (req, res) => {
  const result = await RentalService.getAllRentals(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Rental orders retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const RentalController = {
  getAllRentals,
};