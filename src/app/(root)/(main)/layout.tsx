"use client";

import { useRouteGuard } from "@/app/_hooks/useRouteGuard";
import MainLayout from "@/app/layouts";
import PullToRefresh from "react-simple-pull-to-refresh";

const handleRefresh = async () => {
  window.location.reload();
};
const isPWA = window.matchMedia("(display-mode: standalone)").matches;

const Layout = ({ children }: { children: React.ReactNode }) => {
  useRouteGuard();

  return isPWA ? (
    <PullToRefresh onRefresh={handleRefresh}>
      <MainLayout>{children}</MainLayout>
    </PullToRefresh>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
};

export default Layout;
