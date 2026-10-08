"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { Suspense, ViewTransition } from "react";

const pageData = {
  title: "カテゴリー",
  basePath: "categories",
} as const;

function CategoryList() {
  const { data: categories, error } = useFetch<Category[]>("/api/categories", {
    suspense: true,
  });

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!categories) return null;

  if (categories.length === 0) {
    return (
      <Text size="md" ta="center">
        まだ登録されていません
      </Text>
    );
  }

  return (
    <Box>
      {categories.map((category) => (
        <List
          key={category.id}
          item={category}
          basePath={pageData.basePath}
        />
      ))}
    </Box>
  );
}

const CategoryPage: NextPage = () => {
  const { title, basePath } = pageData;
  const { mutate } = useFetch<Category[]>("/api/categories");

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      <ViewTransition>
        <Suspense fallback={<SkeltonBar />}>
          <CategoryList />
        </Suspense>
      </ViewTransition>
      <BottomSheet mutate={mutate} title={title} basePath={basePath} />
    </Box>
  );
};

export default CategoryPage;
