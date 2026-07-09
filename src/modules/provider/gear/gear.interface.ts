import { GearCondition } from "../../../../generated/prisma/enums.js";

export type TCreateGear = {
  categoryId: string;

  name: string;
  brand: string;
  description: string;
  image?: string;

  pricePerDay: number;

  totalStock: number;

  condition: GearCondition;
};

export type TUpdateGear = Partial<TCreateGear>;

export type TGetAllGearQuery = {
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  isAvailable?: string;
  page?: string;
  limit?: string;
  sortBy?: "pricePerDay" | "createdAt";
  sortOrder?: "asc" | "desc";
};