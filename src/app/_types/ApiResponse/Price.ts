export type Price = {
  id: string;
  store: { id: string; name: string };
  price: number;
  updatedAt: Date;
  text: string;
};

export type FormState = {
  storeId: string;
  price: string | number;
  memo: string;
};
