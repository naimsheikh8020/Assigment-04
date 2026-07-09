export type TCreateReview = {
  rentalOrderItemId: string;
  rating: number;
  comment: string;
};

export type TUpdateReview = {
  rating?: number;
  comment?: string;
};