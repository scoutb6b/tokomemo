"use client";

import { Table } from "../_components/Table";
import { usePathname } from "next/navigation";
import { BottomSheet } from "../_components/BottomSheet";
import { ProductName } from "../_components/ProductName";
import { Box } from "@mantine/core";
import { BackButton } from "@/app/_components/BackButton";
import { ViewTransition } from "react";
import c from "./page.module.css";

const ProductListPage = () => {
  const basePath = usePathname();
  const productId = basePath.split("/").filter(Boolean).pop();

  return (
    <Box>
      <header className={c.header}>
        {productId ? (
          <ViewTransition
            name={`product-${productId}`}
            share="morph"
            default="none"
          >
            <div className={c.frame} aria-hidden="true" />
          </ViewTransition>
        ) : null}
        <div className={c.body}>
          <BackButton path={""} />
          <ProductName path={basePath} />
        </div>
      </header>
      <Box>
        <Table basePath={basePath} />
      </Box>
      <BottomSheet title="価格" basePath={basePath} />
    </Box>
  );
};

export default ProductListPage;
