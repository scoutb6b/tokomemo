import "@mantine/core/styles.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "tokomemo",
  description: "自分だけの複数店舗での価格を比較するアプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
