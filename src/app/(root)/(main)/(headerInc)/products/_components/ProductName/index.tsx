"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex, Skeleton, Title } from "@mantine/core";
import { ViewTransition } from "react";
import { rememberedProductName } from "../productNames";
import { Dots } from "./Dots";

type Props = {
  path: string;
};

type ProductName = Pick<Product, "name">;

export const ProductName: React.FC<Props> = ({ path }) => {
  const { data, error } = useFetch<ProductName[]>(`/api/${path}`);
  const productId = path.split("/").filter(Boolean).pop();
  const visibleName =
    data?.[0]?.name ?? (productId ? rememberedProductName(productId) : undefined);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      {visibleName ? (
        <>
          <ViewTransition
            name={productId ? `product-${productId}` : "auto"}
            share="morph"
            default="none"
          >
            <Title size="h2">{visibleName}</Title>
          </ViewTransition>
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
