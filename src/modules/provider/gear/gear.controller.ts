import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

import { GearService } from "./gear.service";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.createGear(
    req.user.userId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Gear added successfully",
    data: result,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await GearService.updateGear(
    req.user.userId,
    id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await GearService.deleteGear(
    req.user.userId,
    id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Gear deleted successfully",
    data: result,
  });
});

export const GearController = {
  createGear,
  updateGear,
  deleteGear,
};