"use client";

import { Table } from "../_components/Table";
import { usePathname } from "next/navigation";
import { useFetch } from "@/app/_hooks/useFetch";
import { Price } from "@/app/_types/ApiResponse/Price";
import { BottomSheet } from "../_components/BottomSheet";
import { ProductName } from "../_components/ProductName";
import { Box } from "@mantine/core";

const ProductListPage = () => {
  const path = usePathname();

  const { data, error, isLoading, mutate } = useFetch<Price[]>(
    `/api/${path}/price`
  );

  return (
    <Box>
      <ProductName path={path} />
      <Box>
        <Table prices={data} err={error} isLoading={isLoading} />
      </Box>
      <BottomSheet title="価格" basePath={path} mutate={mutate} />
    </Box>
  );
};

export default ProductListPage;
