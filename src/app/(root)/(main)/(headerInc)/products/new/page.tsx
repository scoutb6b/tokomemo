"use client";
import { Box, TextInput, Title } from "@mantine/core";
import { AddButton } from "../_components/AddButton";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { productScheme } from "@/app/_libs/zod/schema";
import { ErrorNotification } from "@/app/_libs/notifications/error";
import { SuccessNotification } from "@/app/_libs/notifications/success";
import { CategorySelect } from "../_components/CategorySelect";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductNewPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
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
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/products`,
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
      SuccessNotification({ title: "商品が追加されました" });
      router.push(`/products/${createData.id}`);
    } catch (error) {
      ErrorNotification({ error });
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
          <CategorySelect form={form} />
          <AddButton submitting={form.submitting} />
        </form>
      </Box>
    </Box>
  );
};

export default ProductNewPage;
