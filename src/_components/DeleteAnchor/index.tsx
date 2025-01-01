"use client";
import { Anchor } from "@mantine/core";
import c from "./index.module.css";

type handleProps = {
  handleDelete: () => void;
};

export const DeleteAnchor: React.FC<handleProps> = ({ handleDelete }) => {
  return (
    <div className={c.delete}>
      <Anchor underline="always" type="button" onClick={handleDelete}>
        削除する
      </Anchor>
    </div>
  );
};
