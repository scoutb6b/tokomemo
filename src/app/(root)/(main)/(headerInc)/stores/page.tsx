"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import {
  invalidateSuspenseFetch,
  useSuspenseFetch,
} from "@/app/_hooks/useSuspenseFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { useState, ViewTransition } from "react";
import {
  FetchBoundary,
  Reveal,
} from "../products/_components/FetchBoundary";

const pageData = {
  title: "お店",
  basePath: "stores",
} as const;

const storeListName = "store-list";

function StoreListFallback() {
  return (
    <ViewTransition name={storeListName} share="morph" default="none">
      <SkeltonBar />
    </ViewTransition>
  );
}

function StoreList() {
  const stores = useSuspenseFetch<Store[]>("/api/stores");

  return (
    <ViewTransition name={storeListName} share="morph" default="none">
      {stores.length === 0 ? (
        <Text size="md" ta="center">
          まだ登録されていません
        </Text>
      ) : (
        <Box>
          {stores.map((store) => (
            <List key={store.id} item={store} basePath={pageData.basePath} />
          ))}
        </Box>
      )}
    </ViewTransition>
  );
}

const StorePage: NextPage = () => {
  const { title, basePath } = pageData;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => {
    invalidateSuspenseFetch("/api/stores");
    setRefreshKey((key) => key + 1);
  };

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      <FetchBoundary key={refreshKey}>
        <Reveal fallback={<StoreListFallback />}>
          <StoreList />
        </Reveal>
      </FetchBoundary>
      <BottomSheet mutate={refresh} title={title} basePath={basePath} />
    </Box>
  );
};

export default StorePage;
