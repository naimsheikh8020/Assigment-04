import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { GearService } from "./gear.service";

const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getAllGear(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Gear retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await GearService.getSingleGear(id as string);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Gear retrieved successfully",
    data: result,
  });
});

export const GearController = {
  getAllGear,
  getSingleGear,
};