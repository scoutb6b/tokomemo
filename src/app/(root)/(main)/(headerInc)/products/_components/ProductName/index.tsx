"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { useSuspenseFetch } from "@/app/_hooks/useSuspenseFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex, Skeleton, Title } from "@mantine/core";
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

function NameRow({ name }: { name: string }) {
  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      <Title size="h2">{name}</Title>
      <Dots />
    </Flex>
  );
}

function NameSkeleton() {
  return (
    <Flex justify="center" align="center" gap="md" pb="xs">
      <Skeleton height={40} width="70%" radius="xl" />
      <Skeleton height={40} width="30%" radius="xl" />
    </Flex>
  );
}

function SuspendedName({ path, productId }: Props & { productId?: string }) {
  const data = useSuspenseFetch<ProductName[]>(`/api/${path}`);
  const name = data[0]?.name ?? "";
  if (productId && name) rememberProductName(productId, name);
  return <NameRow name={name} />;
}

function CachedName({ path, cached }: Props & { cached: string }) {
  const { data, error } = useFetch<ProductName[]>(`/api/${path}`);
  if (error) {
    return <div>{error.message}</div>;
  }
  return <NameRow name={data?.[0]?.name ?? cached} />;
}

export const ProductName: React.FC<Props> = ({ path }) => {
  const productId = productIdFromPath(path);
  const cached = productId ? rememberedProductName(productId) : undefined;

  if (cached) {
    return <CachedName path={path} cached={cached} />;
  }

  return (
    <FetchBoundary>
      <Reveal fallback={<NameSkeleton />}>
        <SuspendedName path={path} productId={productId} />
      </Reveal>
    </FetchBoundary>
  );
};
