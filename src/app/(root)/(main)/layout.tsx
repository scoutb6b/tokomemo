"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import MainLayout from "@/app/layouts";
import PullToRefresh from "react-simple-pull-to-refresh";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();
  const handleRefresh = async () => {
    window.location.reload();
  };
  const isPWA =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  return isPWA ? (
    <PullToRefresh onRefresh={handleRefresh}>
      <MainLayout>{children}</MainLayout>
    </PullToRefresh>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

export default Layout;
