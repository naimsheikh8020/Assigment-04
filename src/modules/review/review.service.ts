import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/AppError";

import { TCreateReview, TUpdateReview } from "./review.interface";
import { RentalStatus } from "../../../generated/prisma/client";

const createReview = async (
  customerId: string,
  payload: TCreateReview,
) => {
  const { rentalOrderItemId, rating, comment } = payload;

  // Find rental item
  const rentalItem = await prisma.rentalOrderItem.findUnique({
    where: {
      id: rentalOrderItemId,
    },
    include: {
      rentalOrder: true,
      gearItem: true,
      review: true,
    },
  });

  if (!rentalItem) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Rental item not found",
    );
  }

  // Check ownership
  if (rentalItem.rentalOrder.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to review this rental",
    );
  }

  // Rental must be completed
  if (rentalItem.rentalOrder.status !== RentalStatus.COMPLETED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You can review only after the rental is completed",
    );
  }

  // Already reviewed?
  if (rentalItem.review) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You have already reviewed this rental item",
    );
  }

  const review = await prisma.review.create({
    data: {
      customerId,
      gearItemId: rentalItem.gearItemId,
      rentalOrderItemId,
      rating,
      comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return review;
};


const getGearReviews = async (gearItemId: string) => {
  return await prisma.review.findMany({
    where: {
      gearItemId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
};

const updateReview = async (
  customerId: string,
  reviewId: string,
  payload: TUpdateReview,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Review not found",
    );
  }

  if (review.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Unauthorized access",
    );
  }

  return await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
  });
};

const deleteReview = async (
  customerId: string,
  reviewId: string,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Review not found",
    );
  }

  if (review.customerId !== customerId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Unauthorized access",
    );
  }

  const result = await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
  getGearReviews,
  updateReview,
  deleteReview,
};