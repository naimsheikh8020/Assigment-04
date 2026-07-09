import { RentalStatus } from "../../../../generated/prisma/enums.js";

export type TUpdateOrderStatus = {
  status: RentalStatus;
};

export type TGetOrderQuery = {
  page?: string;
  limit?: string;
  status?: RentalStatus;
};