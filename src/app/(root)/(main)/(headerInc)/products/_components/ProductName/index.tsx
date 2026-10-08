"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { Product } from "@/app/_types/ApiResponse/Product";
import { Flex, Skeleton, Title } from "@mantine/core";
import { Suspense, ViewTransition } from "react";
import { FetchRecover } from "@/app/_components/FetchRecover";
import { Dots } from "./Dots";

type Props = {
  path: string;
};

type ProductName = Pick<Product, "name">;

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

function SuspendedName({ path }: Props) {
  const { data, error } = useFetch<ProductName[]>(`/api/${path}`, {
    suspense: true,
  });
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) return null;
  return <NameRow name={data[0]?.name ?? ""} />;
}

export const ProductName: React.FC<Props> = ({ path }) => {
  return (
    <ViewTransition>
      <Suspense fallback={<NameSkeleton />}>
        <FetchRecover>
          <SuspendedName path={path} />
        </FetchRecover>
      </Suspense>
    </ViewTransition>
  );
};
