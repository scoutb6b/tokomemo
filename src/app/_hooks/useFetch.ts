"use client";

import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession";

export const useFetch = <T>(path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const { token } = useSupabaseSession();

  const fetcher = async () => {
    if (!token) return;

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
  const results = useSWR(token ? `${baseUrl}${path}` : null, fetcher);
  return results;
};