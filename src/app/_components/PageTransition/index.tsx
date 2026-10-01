"use client";

import type { ReactNode } from "react";
import { ViewTransition } from "react";

const navClasses = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/** ルート遷移向けの方向付き View Transition ラッパー（page.tsx に置く） */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={navClasses}
      exit={navClasses}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
