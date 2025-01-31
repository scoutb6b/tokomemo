import { Button } from "@mantine/core";
import c from "./index.module.css";

type Props = {
  submitting: boolean;
};

export const EditSave = ({ submitting }: Props) => {
  return (
    <Button
      type="submit"
      variant="filled"
      size="md"
      className={c.saveBtn}
      loading={submitting}
    >
      保存する
    </Button>
  );
};
