"use client";

import { BottomSheet } from "@/app/_components/BottomSheet";
import { List } from "@/app/_components/LIst";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
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
    return <div>err!!{error.message}</div>;
  }
  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  if (!cateogries || cateogries.length === 0) {
    return <div>まだ登録がありません。登録はこちら</div>;
  }

  return (
    <div>
      <h1>{title}</h1>

      <div>
        {cateogries.map((category) => {
          return <List key={category.id} item={category} basePath={basePath} />;
        })}
      </div>

      <BottomSheet mutate={mutate} title={title} basePath={basePath} />
    </div>
  );
};

export default CategoryPage;
