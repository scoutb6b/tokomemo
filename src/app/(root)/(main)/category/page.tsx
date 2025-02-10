"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { Box, Text, Title } from "@mantine/core";
import { NextPage } from "next"; //page.tsxにつける型

const pageData = {
  title: "カテゴリー",
  basePath: "category",
} as const;

const CategoryPage: NextPage = () => {
  const { title, basePath } = pageData;
  const {
    data: cateogries,
    error,
    isLoading,
    mutate,
  } = useFetch<Category[]>("/api/category");

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Box>
      <Title size="h2" mb={20}>
        {title}
      </Title>
      {!isLoading ? (
        cateogries?.length === 0 ? (
          <Text size="md" ta="center">
            まだ登録されていません
          </Text>
        ) : (
          <Box>
            {cateogries?.map((category) => {
              return (
                <List key={category.id} item={category} basePath={basePath} />
              );
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

export default CategoryPage;
