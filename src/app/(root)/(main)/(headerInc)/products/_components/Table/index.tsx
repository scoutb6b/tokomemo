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
import c from "./index.module.css";
import { usePrice } from "@/app/_hooks/usePrice";

type Props = {
  basePath: string;
};

export const Table: React.FC<Props> = ({ basePath }) => {
  const path = usePathname();
  const { data, error, isLoading } = usePrice({ basePath });

  if (error) {
    return <div>エラー：{error.message}</div>;
  }

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
      <Stack gap={0}>
        {!isLoading ? (
          data?.length === 0 ? (
            <Text size="md" ta="center">
              まだ登録されていません
            </Text>
          ) : (
            data?.map((price, i) => (
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
          )
        ) : (
          <Skeleton />
        )}
      </Stack>
    </>
  );
};
