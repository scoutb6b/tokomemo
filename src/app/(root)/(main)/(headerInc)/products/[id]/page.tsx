"use client";

import { Table } from "../_components/Table";
import { usePathname } from "next/navigation";
import { BottomSheet } from "../_components/BottomSheet";
import { ProductName } from "../_components/ProductName";
import { Box } from "@mantine/core";
import { BackButton } from "@/app/_components/BackButton";
import { PageTransition } from "@/app/_components/PageTransition";

const ProductListPage = () => {
  const basePath = usePathname();

  return (
    <PageTransition>
      <Box>
        <BackButton path={""} />
        <ProductName path={basePath} />
        <Box>
          <Table basePath={basePath} />
        </Box>
        <BottomSheet title="価格" basePath={basePath} />
      </Box>
    </PageTransition>
  );
};

export default ProductListPage;
