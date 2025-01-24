"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex } from "@mantine/core";
import { Dots } from "./Dots";

type Props = {
  path: string;
};

type ProductName = Pick<Product, "name">;

export const ProductName = ({ path }: Props) => {
  const { data, error, isLoading } = useFetch<ProductName[]>(`/api/${path}`);
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <div>読み込み中</div>;
  }

  return (
    <Flex justify="center" align="center" gap="md">
      <h1>{data && data[0].name}</h1>
      <Dots />
    </Flex>
  );
};
