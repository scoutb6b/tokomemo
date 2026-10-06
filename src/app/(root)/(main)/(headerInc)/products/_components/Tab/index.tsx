"use client";
import { SimpleGrid, Tabs, Text } from "@mantine/core";
import { ViewTransition } from "react";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSuspenseFetch } from "@/app/_hooks/useSuspenseFetch";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { Category } from "@/app/_types/ApiResponse/Category";
import { CardParts } from "../CardParts";
import c from "./index.module.css";
import { SkeletonGrid } from "@/app/_components/Skelton/Grid";
import { FetchBoundary, Reveal } from "../FetchBoundary";

const productListName = "product-list";

function ProductListFallback() {
  return (
    <ViewTransition name={productListName} share="morph" default="none">
      <SimpleGrid cols={2} w={375} px={18}>
        <SkeletonGrid />
      </SimpleGrid>
    </ViewTransition>
  );
}

function ProductPanels({ categories }: { categories?: Category[] }) {
  const products = useSuspenseFetch<ProductMin[]>("/api/products");

  return (
    <>
      <Tabs.Panel value="all">
        <ViewTransition name={productListName} share="morph" default="none">
          <SimpleGrid cols={2} w={375} px={18}>
            {products.length > 0 ? (
              products.map((product) => (
                <CardParts key={product.id} item={product} />
              ))
            ) : (
              <Text size="md">まだ商品がありません</Text>
            )}
          </SimpleGrid>
        </ViewTransition>
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

      <FetchBoundary>
        <Reveal fallback={<ProductListFallback />}>
          <ProductPanels categories={categories} />
        </Reveal>
      </FetchBoundary>
    </Tabs>
  );
};
