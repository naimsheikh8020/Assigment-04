import { StatusCodes } from "http-status-codes";
import { ReviewService } from "./review.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

const createReview = catchAsync(async (req, res) => {
  const customerId = req.user.userId;

  const result = await ReviewService.createReview(
    customerId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getGearReviews = catchAsync(async (req, res) => {
  const { gearItemId } = req.params;

  const result = await ReviewService.getGearReviews(
    gearItemId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const { id } = req.params;

  const result = await ReviewService.updateReview(
    customerId,
    id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const { id } = req.params;

  await ReviewService.deleteReview(customerId, id as string);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewController = {
  createReview,
  getGearReviews,
  updateReview,
  deleteReview,
};