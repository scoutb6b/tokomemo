"use client";

import { Component, useEffect, type ReactNode } from "react";
import { useSWRConfig } from "swr";

function DropFailedFetch({ onDone }: { onDone: () => void }) {
  const { cache } = useSWRConfig();
  useEffect(() => {
    for (const key of cache.keys()) {
      const current = cache.get(key);
      if (current?.error) cache.delete(key);
    }
    onDone();
  }, [cache, onDone]);
  return null;
}

type Props = { children: ReactNode };
type State = { error: Error | null; attempt: number };

export class FetchRecover extends Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Pick<State, "error"> {
    return { error };
  }

  private retry = () => {
    this.setState((state) => ({ error: null, attempt: state.attempt + 1 }));
  };

  render() {
    const { error, attempt } = this.state;
    if (error && attempt < 1) {
      return <DropFailedFetch onDone={this.retry} />;
    }
    if (error) {
      return <div>{error.message}</div>;
    }
    return this.props.children;
  }
}
