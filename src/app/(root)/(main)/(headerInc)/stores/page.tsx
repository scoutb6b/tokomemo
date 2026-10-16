"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { FetchRecover } from "@/app/_components/FetchRecover";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { Suspense, ViewTransition } from "react";

const pageData = {
  title: "お店",
  basePath: "stores",
} as const;

function StoreList() {
  const { data: stores, error } = useFetch<Store[]>("/api/stores", {
    suspense: true,
  });

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!stores) return null;

  if (stores.length === 0) {
    return (
      <Text size="md" ta="center">
        まだ登録されていません
      </Text>
    );
  }

  return (
    <Box>
      {stores.map((store) => (
        <List key={store.id} item={store} basePath={pageData.basePath} />
      ))}
    </Box>
  );
}

const StorePage: NextPage = () => {
  const { title, basePath } = pageData;
  const { mutate } = useFetch<Store[]>("/api/stores");

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      <ViewTransition>
        <Suspense fallback={<SkeltonBar />}>
          <FetchRecover>
            <StoreList />
          </FetchRecover>
        </Suspense>
      </ViewTransition>
      <BottomSheet mutate={mutate} title={title} basePath={basePath} />
    </Box>
  );
};

export default StorePage;
