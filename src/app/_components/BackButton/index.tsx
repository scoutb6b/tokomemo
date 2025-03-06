"use client";

import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type Props = {
  path: string;
};

export const BackButton: React.FC<Props> = ({ path }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/products/${path}`)}
      leftSection={<IconChevronLeft size={20} />}
      variant="white"
      size="xs"
      color="gray"
      styles={{
        section: { margin: 0 },
      }}
    >
      1つ戻る
    </Button>
  );
};
