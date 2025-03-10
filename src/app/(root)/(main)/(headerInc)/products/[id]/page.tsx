"use client";

import { Table } from "../_components/Table";
import { usePathname } from "next/navigation";
import { BottomSheet } from "../_components/BottomSheet";
import { ProductName } from "../_components/ProductName";
import { Box } from "@mantine/core";
import { BackButton } from "@/app/_components/BackButton";

const ProductListPage = () => {
  const basePath = usePathname();

  return (
    <Box>
      <BackButton path={""} />
      <ProductName path={basePath} />
      <Box>
        <Table basePath={basePath} />
      </Box>
      <BottomSheet title="価格" basePath={basePath} />
    </Box>
  );
};

export default ProductListPage;
