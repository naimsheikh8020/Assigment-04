import { UserRole } from "../../../generated/prisma/enums.js";

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TJwtPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

export type TJwtResponse = {
  accessToken: string;
  refreshToken: string;
};