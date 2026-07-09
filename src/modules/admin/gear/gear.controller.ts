import { StatusCodes } from "http-status-codes";

import { GearService } from "./gear.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";

const getAllGear = catchAsync(async (req, res) => {
  const result = await GearService.getAllGear(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Gear retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const GearController = {
  getAllGear,
};