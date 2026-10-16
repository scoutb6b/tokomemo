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
import { Suspense, ViewTransition } from "react";
import c from "./index.module.css";
import { FetchRecover } from "@/app/_components/FetchRecover";
import { usePrice } from "@/app/_hooks/usePrice";

type Props = {
  basePath: string;
};

function PriceRows({ basePath }: Props) {
  const path = usePathname();
  const { data, error } = usePrice({ basePath }, { suspense: true });

  if (error) {
    return <div>エラー：{error.message}</div>;
  }
  if (!data) return null;

  return (
    <Stack gap={0}>
      {data.length === 0 ? (
        <Text size="md" ta="center">
          まだ登録されていません
        </Text>
      ) : (
        data.map((price, i) => (
          <Link href={`${path}/${price.id}`} key={price.id} className={c.row}>
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
      <ViewTransition>
        <Suspense fallback={<Skeleton />}>
          <FetchRecover>
            <PriceRows basePath={basePath} />
          </FetchRecover>
        </Suspense>
      </ViewTransition>
    </>
  );
};
