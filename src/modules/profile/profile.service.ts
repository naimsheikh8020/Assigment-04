import { StatusCodes } from "http-status-codes";

import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/AppError.js";

import { TUpdateProfile } from "./profile.interface.js";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "User not found",
    );
  }

  return user;
};

const updateProfile = async (
  userId: string,
  payload: TUpdateProfile,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "User not found",
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      phone: payload.phone,
      avatar: payload.avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const ProfileService = {
  getMyProfile,
  updateProfile,
};