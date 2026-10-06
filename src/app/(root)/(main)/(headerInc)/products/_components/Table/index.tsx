"use client";
import {
  Text,
  Stack,
  Grid,
  GridCol,
  NumberFormatter,
  Skeleton,
} from "@mantine/core";
import { IconChevronRight, IconCrown } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";
import c from "./index.module.css";
import { useSuspenseFetch } from "@/app/_hooks/useSuspenseFetch";
import { Price } from "@/app/_types/ApiResponse/Price";
import { FetchBoundary, Reveal } from "../FetchBoundary";

type Props = {
  basePath: string;
};

const priceListName = "product-prices";

function PriceSkeleton() {
  return (
    <ViewTransition name={priceListName} share="morph" default="none">
      <Skeleton />
    </ViewTransition>
  );
}

function PriceRows({ basePath }: Props) {
  const path = usePathname();
  const data = useSuspenseFetch<Price[]>(`/api/${basePath}/price`);

  return (
    <ViewTransition name={priceListName} share="morph" default="none">
      <Stack gap={0}>
        {data.length === 0 ? (
          <Text size="md" ta="center">
            まだ登録されていません
          </Text>
        ) : (
          data.map((price, i) => (
            <Link
              href={`${path}/${price.id}`}
              key={price.id}
              className={c.row}
            >
              <Grid>
                <GridCol span={1} className={c.crown}>
                  {i === 0 && <IconCrown color="#e6b422" />}
                </GridCol>
                <GridCol span={6}>
                  <Text size="xl">{price.store.name}</Text>
                </GridCol>
                <GridCol span={4}>
                  <Text size="xl">
                    <NumberFormatter value={price.price} thousandSeparator />
                  </Text>
                </GridCol>
                <GridCol span={1} className={c.arrow}>
                  <IconChevronRight />
                </GridCol>
              </Grid>
            </Link>
          ))
        )}
      </Stack>
    </ViewTransition>
  );
}

export const Table: React.FC<Props> = ({ basePath }) => {
  return (
    <>
      <Grid className={c.head}>
        <GridCol span={1} />
        <GridCol span={6}>
          <Text size="lg">お店</Text>
        </GridCol>
        <GridCol span={5}>
          <Text size="lg">値段</Text>
        </GridCol>
      </Grid>
      <FetchBoundary>
        <Reveal fallback={<PriceSkeleton />}>
          <PriceRows basePath={basePath} />
        </Reveal>
      </FetchBoundary>
    </>
  );
};
