"use client";

import { Button } from "@mantine/core";
import c from "./index.module.css";

export const AddButton = () => {
  return (
    <Button type="submit" variant="filled" size="md" className={c.addBtn}>
      追加する
    </Button>
  );
};
