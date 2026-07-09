import { UserStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../config/prisma.js";
import { TLoginUser, TRegisterUser } from "./auth.interface.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { createToken } from "../../utils/jwt.js";
import { AppError } from "../../middlewares/AppError.js";
import { StatusCodes } from "http-status-codes";
import config from "../../config/index.js";

const registerUser = async (payload: TRegisterUser) => {
  // check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "User already exists");
  }

  // hash password
  const hashedPassword = await hashPassword(payload.password);

  // create user
  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  return user;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new Error("Your account has been suspended.");
  }

  const isPasswordMatched = await comparePassword(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_screct,
    config.jwt_access_expires_in,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_screct,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};
