"use client";
import { SimpleGrid, Tabs, Text } from "@mantine/core";
import { Suspense, ViewTransition } from "react";
import { useFetch } from "@/app/_hooks/useFetch";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { Category } from "@/app/_types/ApiResponse/Category";
import { CardParts } from "../CardParts";
import c from "./index.module.css";
import { FetchRecover } from "@/app/_components/FetchRecover";
import { SkeletonGrid } from "@/app/_components/Skelton/Grid";

function ProductPanels({ categories }: { categories?: Category[] }) {
  const { data: products, error } = useFetch<ProductMin[]>("/api/products", {
    suspense: true,
  });

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!products) return null;

  return (
    <>
      <Tabs.Panel value="all">
        <SimpleGrid cols={2} w={375} px={18}>
          {products.length > 0 ? (
            products.map((product) => (
              <CardParts key={product.id} item={product} />
            ))
          ) : (
            <Text size="md">まだ商品がありません</Text>
          )}
        </SimpleGrid>
      </Tabs.Panel>
      {categories?.map((category) => (
        <Tabs.Panel value={category.id} key={category.id}>
          {products.filter((item) => item.category?.id === category.id).length >
          0 ? (
            <SimpleGrid cols={2} w={375} px={18}>
              {products
                .filter((item) => item.category?.id === category.id)
                .map((item) => (
                  <CardParts key={item.id} item={item} />
                ))}
            </SimpleGrid>
          ) : (
            <Text size="md">このカテゴリーには商品がありません</Text>
          )}
        </Tabs.Panel>
      ))}
    </>
  );
}

export const Tab: React.FC = () => {
  const { data: categories, error: categoryError } =
    useFetch<Category[]>("/api/categories");

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

      <ViewTransition>
        <Suspense
          fallback={
            <SimpleGrid cols={2} w={375} px={18}>
              <SkeletonGrid />
            </SimpleGrid>
          }
        >
          <FetchRecover>
            <ProductPanels categories={categories} />
          </FetchRecover>
        </Suspense>
      </ViewTransition>
    </Tabs>
  );
};
