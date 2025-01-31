"use client";

import { Button } from "@mantine/core";
import c from "./index.module.css";

type Props = {
  submitting: boolean;
};

export const AddButton = ({ submitting }: Props) => {
  return (
    <Button
      type="submit"
      variant="filled"
      size="md"
      className={c.addBtn}
      loading={submitting}
    >
      追加する
    </Button>
  );
};
