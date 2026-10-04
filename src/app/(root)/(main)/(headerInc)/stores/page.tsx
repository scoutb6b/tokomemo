"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next"; //page.tsxにつける型

const pageData = {
  title: "お店",
  basePath: "stores",
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
  } = useFetch<Store[]>("/api/stores");

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      {!isLoading ? (
        stores?.length === 0 ? (
          <Text size="md" ta="center">
            まだ登録されていません
          </Text>
        ) : (
          <Box>
            {stores?.map((store) => {
              return <List key={store.id} item={store} basePath={basePath} />;
            })}
          </Box>
        )
      ) : (
        <SkeltonBar />
      )}

      <BottomSheet mutate={mutate} title={title} basePath={basePath} />
    </Box>
  );
};

export default StorePage;
