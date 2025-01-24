"use client";

import { Table } from "../_components/Table";
import { usePathname } from "next/navigation";
import { useFetch } from "@/app/_hooks/useFetch";
import { Price } from "@/app/_types/ApiResponse/Price";
import { BottomSheet } from "../_components/BottomSheet";
import { ProductName } from "../_components/ProductName";

const ProductListPage = () => {
  const path = usePathname();

  const { data, error, isLoading, mutate } = useFetch<Price[]>(
    `/api/${path}/price`
  );

  return (
    <div>
      <ProductName path={path} />
      <div>
        <Table prices={data} err={error} isLoading={isLoading} />
      </div>
      <BottomSheet title="価格" basePath={path} mutate={mutate} />
    </div>
  );
};

export default ProductListPage;
