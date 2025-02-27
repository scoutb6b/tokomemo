"use client";

import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
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
