import { StatusCodes } from "http-status-codes";

import { ProfileService } from "./profile.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileService.getMyProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await ProfileService.updateProfile(
    userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
  updateProfile,
};