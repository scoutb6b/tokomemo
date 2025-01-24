import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import c from "./index.module.css";

export const AddIcon = () => {
  return (
    <Button component={Link} href={"product/new"} className={c.addIcon}>
      <IconPlus stroke={2} size={26} />
    </Button>
  );
};
