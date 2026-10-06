"use client";

import { use } from "react";
import { supabase } from "../_libs/supabase";

const resolved = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

async function load(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) {
    throw new Error("ログインが必要です");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (res.status !== 200) {
    const errorData = await res.json();
    throw new Error(errorData.message || "データ取得中にエラー");
  }
  return res.json();
}

export function invalidateSuspenseFetch(path: string) {
  const key = `${process.env.NEXT_PUBLIC_APP_BASE_URL}${path}`;
  resolved.delete(key);
  pending.delete(key);
}

export function useSuspenseFetch<T>(path: string): T {
  if (typeof window === "undefined") {
    throw new Error("useSuspenseFetch はブラウザでのみ使えます");
  }

  const key = `${process.env.NEXT_PUBLIC_APP_BASE_URL}${path}`;
  if (resolved.has(key)) {
    return resolved.get(key) as T;
  }

  let promise = pending.get(key) as Promise<T> | undefined;
  if (!promise) {
    promise = load(path) as Promise<T>;
    pending.set(key, promise);
    promise.then(
      (data) => {
        resolved.set(key, data);
        pending.delete(key);
      },
      () => {
        pending.delete(key);
      }
    );
  }

  return use(promise);
}
