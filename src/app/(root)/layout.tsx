import "@mantine/core/styles.css";
import "../globals.css";
import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";

export const metadata: Metadata = {
  title: "tokomemo",
  description: "自分だけの複数店舗での価格を比較するアプリ",
};

const theme = createTheme({
  fontFamily: "Murecho",

  headings: {
    sizes: {
      h1: { fontWeight: "700" },
      h2: { fontWeight: "600" },
      h3: { fontWeight: "500" },
    },
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
