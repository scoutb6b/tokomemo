"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import MainLayout from "@/app/layouts";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();

  return <MainLayout>{children}</MainLayout>;
};

export default Layout;
