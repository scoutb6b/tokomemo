export type Product = {
  id: string;
  name: string;
  category: { id: string; name: string } | null;
};

export type ProductMin = {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  } | null;
  price: {
    id: string;
    price: number;
    store: { id: string; name: string };
  }[];
};
