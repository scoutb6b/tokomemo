"use client";

import { useRouteGuard } from "@/_hooks/useRouteGuard";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();

  return <div>{children}</div>;
};

export default MainLayout;
