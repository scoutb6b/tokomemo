"use client";
import { NativeSelect, TextInput } from "@mantine/core";
import { AddButton } from "../_components/AddButton";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductNewPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [product, setProduct] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const { data: cateogries } = useFetch<Category[]>("/api/category");

  const categoryArr = cateogries?.map((category: CategorySelect) => {
    return { value: category.id, label: category.name };
  });

  const categorySelect = [
    { value: "", label: "カテゴリなし" },
    ...(categoryArr ?? []),
  ];

  const clickCreate = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;

    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ product, categoryId: categoryId || null }),
        }
      );
      const createData = await res.json();
      notifications.show({
        title: "商品の登録が完了しました",
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "green",
      });
      router.push(`/product/${createData.id}`);
    } catch (error) {
      notifications.show({
        title: "エラーが発生しました",
        message: `${error}`,
        autoClose: 2500,
        position: "bottom-right",
        color: "red",
      });
    }
  };

  return (
    <div>
      <h1>商品追加</h1>
      <div>
        <form onSubmit={clickCreate}>
          <TextInput
            size="md"
            radius="md"
            label="商品名"
            value={product}
            onChange={(e) => setProduct(e.currentTarget.value)}
          />
          <NativeSelect
            size="md"
            radius="md"
            mt="lg"
            label="カテゴリー"
            value={categoryId}
            onChange={(e) => setCategoryId(e.currentTarget.value)}
            data={categorySelect}
          />
          <AddButton />
        </form>
      </div>
    </div>
  );
};

export default ProductNewPage;
