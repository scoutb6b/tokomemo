"use client";
import { Box, NativeSelect, TextInput, Title } from "@mantine/core";
import { AddButton } from "../_components/AddButton";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { productScheme } from "@/app/_libs/zod/schema";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductNewPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data: categories } = useFetch<Category[]>("/api/category");

  const categoryArr =
    categories && categories.length > 0
      ? categories.map((category: CategorySelect) => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  const categorySelect = [{ value: "", label: "カテゴリなし" }, ...categoryArr];
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      product: "",
      categoryId: "",
    },
    validate: zodResolver(productScheme),
  });

  const clickCreate = async (
    _value: typeof form.values,
    e: FormEvent<HTMLFormElement> | undefined
  ) => {
    if (!token) return;
    e?.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { product, categoryId } = form.getValues();
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
    <Box>
      <Title size="h2">商品追加</Title>
      <Box w="94%" mx="auto">
        <form onSubmit={form.onSubmit(clickCreate)}>
          <TextInput
            size="md"
            radius="md"
            label="商品名"
            {...form.getInputProps("product")}
            error={form.errors.product}
            disabled={form.submitting}
          />
          <NativeSelect
            size="md"
            radius="md"
            mt="lg"
            label="カテゴリー(なしでも登録可能です)"
            {...form.getInputProps("categoryId")}
            data={categorySelect}
            disabled={form.submitting}
          />
          <AddButton submitting={form.submitting} />
        </form>
      </Box>
    </Box>
  );
};

export default ProductNewPage;
