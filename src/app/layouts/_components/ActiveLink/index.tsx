"use client";

import { Anchor, Stack, Text } from "@mantine/core";
import { useActivePath } from "@/app/_hooks/useActivePath";
import c from "@/app/layouts/footer.module.css";
import { ReactNode } from "react";

type FooterProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

export const ActiveLink = (item: FooterProps) => {
  const active = useActivePath(item.href);

  return (
    <Anchor
      href={item.href}
      underline="never"
      className={active ? c.footerActive : c.footerNonActive}
    >
      <Stack gap="xs" align="center">
        {item.icon}
        <Text size="sm" fw="bold">
          {item.label}
        </Text>
      </Stack>
    </Anchor>
  );
};
