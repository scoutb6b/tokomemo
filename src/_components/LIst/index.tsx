import { Flex, Paper, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import c from "./index.module.css";
import { Store } from "@/_types/apiResponse";

type itemProps = {
  item: Pick<Store, "id" | "name">;
  basePath: string;
};

export const List = ({ item, basePath }: itemProps) => {
  return (
    <Paper component={Link} href={`/${basePath}/${item.id}`} className={c.list}>
      <Flex justify="space-between" align="center">
        <Text fz="xl">{item.name}</Text>
        <IconEdit size={24} />
      </Flex>
    </Paper>
  );
};
