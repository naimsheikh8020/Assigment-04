import {
  UserRole,
  UserStatus,
} from "../../../../generated/prisma/enums.js";

export type TGetAllUsersQuery = {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  limit?: number;
};

export type TUpdateUserStatus = {
  status: UserStatus;
};