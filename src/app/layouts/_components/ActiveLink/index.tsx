"use client";

import { Stack, Text } from "@mantine/core";
import Link from "next/link";
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
    <Link
      href={item.href}
      transitionTypes={["nav-forward"]}
      className={active ? c.footerActive : c.footerNonActive}
      style={{ textDecoration: "none" }}
    >
      <Stack gap="xs" align="center">
        {item.icon}
        <Text size="sm" fw="bold">
          {item.label}
        </Text>
      </Stack>
    </Link>
  );
};
