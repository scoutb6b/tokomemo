"use client";
import { SimpleGrid, Tabs, Text } from "@mantine/core";
import { useFetch } from "@/app/_hooks/useFetch";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { Category } from "@/app/_types/ApiResponse/Category";
import { CardParts } from "../CardParts";
import c from "./index.module.css";

export const Tab = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useFetch<ProductMin[]>("/api/product");
  console.log(products);

  const {
    data: categories,
    error: categoryErr,
    isLoading: categoryLoading,
  } = useFetch<Category[]>("/api/category");

  if (isLoading) {
    return <div>...読み込み中</div>;
  }
  if (categoryLoading) {
    return <div>...読み込み中</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (categoryErr) {
    return <div>{categoryErr.message}</div>;
  }
  if (products?.length === 0) {
    return <div>まだ登録がされていません。</div>;
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
        {/* {!products || products.length === 0 ? (
        <div>なし！！！</div>
      ) : ( */}
        <SimpleGrid cols={2} w={375} px={18}>
          {products?.map((product) => (
            <CardParts key={product.id} item={product} />
          ))}
        </SimpleGrid>
        {/* )} */}
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
