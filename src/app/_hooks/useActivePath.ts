"use client";

import { usePathname } from "next/navigation";

export const useActivePath = (basePath: string) => {
  const pathname = usePathname();

  return pathname.includes(`${basePath}`);
};
