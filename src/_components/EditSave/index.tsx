import { Button } from "@mantine/core";
import c from "./index.module.css";

export const EditSave = () => {
  return (
    <Button type="submit" variant="filled" size="md" className={c.saveBtn}>
      保存する
    </Button>
  );
};
