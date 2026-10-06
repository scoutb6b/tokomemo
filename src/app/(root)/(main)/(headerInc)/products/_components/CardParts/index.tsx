"use client";

import { Card, NumberFormatter, Text, Title } from "@mantine/core";
import Link from "next/link";
import { ViewTransition } from "react";
import c from "./index.module.css";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { rememberProductName } from "../productNames";

type ProductProps = {
  item: Omit<ProductMin, "category">;
};

export const CardParts: React.FC<ProductProps> = ({ item }) => {
  rememberProductName(item.id, item.name);

  return (
    <Card component={Link} href={`products/${item.id}`} className={c.card}>
      <ViewTransition
        name={`product-${item.id}`}
        share="morph"
        default="none"
      >
        <span className={c.frame} aria-hidden="true" />
      </ViewTransition>
      <div className={c.body}>
        <Title size={20} lineClamp={1} ta="center" fw="medium">
          {item.name}
        </Title>
        <Text fz={30} ta="right" fw="medium">
          {item.price[0] ? (
            <NumberFormatter
              prefix="¥"
              value={item.price[0].price}
              thousandSeparator
            />
          ) : (
            "--"
          )}
        </Text>
        <Text fz="sm" ta="right">
          {item.price[0]?.store.name ?? "--"}
        </Text>
      </div>
    </Card>
  );
};
