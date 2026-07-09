import { RentalStatus } from "../../../../generated/prisma/enums";

export type TUpdateOrderStatus = {
  status: RentalStatus;
};

export type TGetOrderQuery = {
  page?: string;
  limit?: string;
  status?: RentalStatus;
};