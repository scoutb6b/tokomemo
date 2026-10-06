"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import {
  invalidateSuspenseFetch,
  useSuspenseFetch,
} from "@/app/_hooks/useSuspenseFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { useState, ViewTransition } from "react";
import {
  FetchBoundary,
  Reveal,
} from "../products/_components/FetchBoundary";

const pageData = {
  title: "カテゴリー",
  basePath: "categories",
} as const;

const categoryListName = "category-list";

function CategoryListFallback() {
  return (
    <ViewTransition name={categoryListName} share="morph" default="none">
      <SkeltonBar />
    </ViewTransition>
  );
}

function CategoryList() {
  const categories = useSuspenseFetch<Category[]>("/api/categories");

  return (
    <ViewTransition name={categoryListName} share="morph" default="none">
      {categories.length === 0 ? (
        <Text size="md" ta="center">
          まだ登録されていません
        </Text>
      ) : (
        <Box>
          {categories.map((category) => (
            <List
              key={category.id}
              item={category}
              basePath={pageData.basePath}
            />
          ))}
        </Box>
      )}
    </ViewTransition>
  );
}

const CategoryPage: NextPage = () => {
  const { title, basePath } = pageData;
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => {
    invalidateSuspenseFetch("/api/categories");
    setRefreshKey((key) => key + 1);
  };

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      <FetchBoundary key={refreshKey}>
        <Reveal fallback={<CategoryListFallback />}>
          <CategoryList />
        </Reveal>
      </FetchBoundary>
      <BottomSheet mutate={refresh} title={title} basePath={basePath} />
    </Box>
  );
};

export default CategoryPage;
