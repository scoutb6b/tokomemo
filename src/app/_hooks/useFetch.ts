"use client";

import { useSyncExternalStore } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { supabase } from "../_libs/supabase";

const subscribe = () => () => {};

export const useFetch = <T>(
  path: string,
  config?: SWRConfiguration<T | undefined>
) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  // SWR は fallback なしの Suspense をサーバー描画で例外にする。
  // ブラウザに入ってから suspend させ、fallback を出せるようにする。
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const suspense = Boolean(config?.suspense) && isClient;

  const fetcher = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      if (suspense) throw new Error("セッションがありません");
      return;
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (res.status !== 200) {
      //res.okと書いていたが、okは200番台全て許容なので、200しかない今回は res.status !== 200
      const errorData = await res.json();
      throw new Error(errorData.message || "データ取得中にエラー");
    }
    const data: T = await res.json();
    return data;
  };
  return useSWR(`${baseUrl}${path}`, fetcher, {
    ...config,
    suspense,
  });
};
