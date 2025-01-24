"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { NextPage } from "next"; //page.tsxにつける型

const pageData = {
  title: "お店",
  basePath: "store",
} as const;

const StorePage: NextPage = () => {
  const { title, basePath } = pageData;
  // const { token } = useSupabaseSession();

  // const fetcher = async () => {
  //   if (!token) {
  //     throw new Error("セッションが切れました。再度ログイン");
  //   }
  //   const res = await fetch("http://localhost:3000/api/store", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //   });
  //   if (!res.ok) {
  //     throw new Error("エラーにつきデータの取得に失敗した");
  //   }
  //   const json = await res.json();
  //   return json;
  // };

  // const { data: stores, error, isLoading } = useSWR(token ? "http://localhost:3000/api/store" : null, fetcher);

  //↑をこれをカスタムhookかしてuseFetch

  const {
    data: stores,
    error,
    isLoading,
    mutate,
  } = useFetch<Store[]>("/api/store");

  if (error) {
    return <div>err!!{error.message}</div>;
  }
  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  if (stores?.length === 0) {
    return <div>まだ登録がされていません。</div>;
  }
  console.log(stores);

  return (
    <div>
      <h1>{title}</h1>

      <div>
        {stores?.map((store) => {
          return <List key={store.id} item={store} basePath={basePath} />;
        })}
      </div>

      <BottomSheet mutate={mutate} title={title} basePath={basePath} />
    </div>
  );
};

export default StorePage;
