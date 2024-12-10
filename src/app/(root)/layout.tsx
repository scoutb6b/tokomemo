import "@mantine/core/styles.css";
import "../globals.css";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "tokomemo",
  description: "自分だけの複数店舗での価格を比較するアプリ",
};
const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <main>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </main>
      </body>
    </html>
  );
}
