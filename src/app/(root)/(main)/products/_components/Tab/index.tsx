"use client";
import { SimpleGrid, Tabs, Text } from "@mantine/core";
import { useFetch } from "@/app/_hooks/useFetch";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { Category } from "@/app/_types/ApiResponse/Category";
import { CardParts } from "../CardParts";
import c from "./index.module.css";
import { SkeletonGrid } from "@/app/_components/Skelton/Grid";

export const Tab = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useFetch<ProductMin[]>("/api/products");

  const { data: categories, error: categoryError } =
    useFetch<Category[]>("/api/categories");

  if (error) {
    return <div>{error.message}</div>;
  }
  if (categoryError) {
    return <div>{categoryError.message}</div>;
  }

  return (
    <Tabs defaultValue="all" color="green">
      <Tabs.List className={c.tabList}>
        <Tabs.Tab value="all">すべて</Tabs.Tab>
        {categories?.map((category) => {
          return (
            <Tabs.Tab value={category.id} key={category.id}>
              {category.name}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>

      <Tabs.Panel value="all">
        <SimpleGrid cols={2} w={375} px={18}>
          {!isLoading ? (
            products?.map((product) => (
              <CardParts key={product.id} item={product} />
            ))
          ) : (
            <SkeletonGrid />
          )}
        </SimpleGrid>
      </Tabs.Panel>
      {categories?.map((category) => (
        <Tabs.Panel value={category.id} key={category.id}>
          {products &&
          products?.filter((c) => c.category?.id === category.id).length > 0 ? (
            <SimpleGrid cols={2} w={375} px={18}>
              {products
                ?.filter((c) => c.category?.id === category.id)
                .map((s) => (
                  <CardParts key={s.id} item={s} />
                ))}
            </SimpleGrid>
          ) : (
            <Text size="md">このカテゴリーには商品がありません</Text>
          )}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
