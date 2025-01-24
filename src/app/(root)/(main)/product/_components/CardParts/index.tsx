import { Card, NumberFormatter, Text } from "@mantine/core";
import Link from "next/link";
import c from "./index.module.css";
import { ProductMin } from "@/app/_types/ApiResponse/Product";

type ProductProps = {
  item: Omit<ProductMin, "category">;
};

export const CardParts = ({ item }: ProductProps) => {
  return (
    <Card component={Link} href={`product/${item.id}`} className={c.card}>
      <Text fz="xl" ta="center" fw="bold">
        {item.name}
      </Text>
      <Text fz={32} ta="right" fw="bold">
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
    </Card>
  );
};
