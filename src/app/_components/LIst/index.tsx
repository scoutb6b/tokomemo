import { Flex, Paper, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import c from "./index.module.css";
import { Store } from "@/app/_types/ApiResponse/Store";

type itemProps = {
  item: Pick<Store, "id" | "name">;
  basePath: string;
};

export const List: React.FC<itemProps> = ({ item, basePath }) => {
  return (
    <Paper component={Link} href={`/${basePath}/${item.id}`} className={c.list}>
      <Flex justify="space-between" align="center">
        <Text fz="xl">{item.name}</Text>
        <IconEdit size={24} />
      </Flex>
    </Paper>
  );
};
