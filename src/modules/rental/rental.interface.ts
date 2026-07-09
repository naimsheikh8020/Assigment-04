export type TRentalItem = {
  gearItemId: string;
  quantity: number;
};

export type TCreateRental = {
  startDate: Date;
  endDate: Date;
  items: TRentalItem[];
};

export type TGetRentalQuery = {
  page?: string;
  limit?: string;
  status?: string;
};