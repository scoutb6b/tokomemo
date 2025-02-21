"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex, Skeleton, Title } from "@mantine/core";
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

  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      {!isLoading ? (
        <>
          <Title size="h2">{data && data[0].name}</Title>
          <Dots />
        </>
      ) : (
        <>
          <Skeleton height={40} width="70%" radius="xl" />
          <Skeleton height={40} width="30%" radius="xl" />
        </>
      )}
    </Flex>
  );
};
