"use client";

import { Component, Suspense, useEffect, useState, startTransition, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { message: string | null };

export class FetchBoundary extends Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message };
  }

  render() {
    if (this.state.message) {
      return <div>{this.state.message}</div>;
    }
    return this.props.children;
  }
}

export function Reveal({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startTransition(() => setReady(true));
  }, []);

  if (!ready) return fallback;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
