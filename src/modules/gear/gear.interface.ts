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