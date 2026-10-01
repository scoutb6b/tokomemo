"use client";

import { Flex, Paper, Text } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { ViewTransition } from "react";
import c from "./index.module.css";
import { Store } from "@/app/_types/ApiResponse/Store";

type itemProps = {
  item: Pick<Store, "id" | "name">;
  basePath: string;
};

export const List: React.FC<itemProps> = ({ item, basePath }) => {
  return (
    <Paper
      component={Link}
      href={`/${basePath}/${item.id}`}
      transitionTypes={["nav-forward"]}
      className={c.list}
    >
      <Flex justify="space-between" align="center">
        <ViewTransition
          name={`${basePath}-${item.id}`}
          share="morph"
          default="none"
        >
          <Text fz="xl">{item.name}</Text>
        </ViewTransition>
        <IconEdit size={24} />
      </Flex>
    </Paper>
  );
};
