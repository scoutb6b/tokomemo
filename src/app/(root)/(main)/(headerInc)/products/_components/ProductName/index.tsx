"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { useSuspenseFetch } from "@/app/_hooks/useSuspenseFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex, Skeleton, Title } from "@mantine/core";
import { ViewTransition } from "react";
import { rememberedProductName, rememberProductName } from "../productNames";
import { FetchBoundary, Reveal } from "../FetchBoundary";
import { Dots } from "./Dots";

type Props = {
  path: string;
};

type ProductName = Pick<Product, "name">;

function productIdFromPath(path: string) {
  return path.split("/").filter(Boolean).pop();
}

function NameRow({
  productId,
  name,
}: {
  productId?: string;
  name: string;
}) {
  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      <ViewTransition
        name={productId ? `product-${productId}` : "auto"}
        share="morph"
        default="none"
      >
        <Title size="h2">{name}</Title>
      </ViewTransition>
      <Dots />
    </Flex>
  );
}

function NameSkeleton({ productId }: { productId?: string }) {
  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      <ViewTransition
        name={productId ? `product-${productId}` : "auto"}
        share="morph"
        default="none"
      >
        <Skeleton height={40} width="70%" radius="xl" />
      </ViewTransition>
      <Skeleton height={40} width="30%" radius="xl" />
    </Flex>
  );
}

function SuspendedName({ path, productId }: Props & { productId?: string }) {
  const data = useSuspenseFetch<ProductName[]>(`/api/${path}`);
  const name = data[0]?.name ?? "";
  if (productId && name) rememberProductName(productId, name);
  return <NameRow productId={productId} name={name} />;
}

function CachedName({
  path,
  productId,
  cached,
}: Props & { productId?: string; cached: string }) {
  const { data, error } = useFetch<ProductName[]>(`/api/${path}`);
  if (error) {
    return <div>{error.message}</div>;
  }
  return <NameRow productId={productId} name={data?.[0]?.name ?? cached} />;
}

export const ProductName: React.FC<Props> = ({ path }) => {
  const productId = productIdFromPath(path);
  const cached = productId ? rememberedProductName(productId) : undefined;

  if (cached) {
    return <CachedName path={path} productId={productId} cached={cached} />;
  }

  return (
    <FetchBoundary>
      <Reveal fallback={<NameSkeleton productId={productId} />}>
        <SuspendedName path={path} productId={productId} />
      </Reveal>
    </FetchBoundary>
  );
};
