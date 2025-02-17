"use client";
import { Text, Box, NativeSelect, TextInput, Title } from "@mantine/core";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent, useEffect } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { NextPage } from "next";
import { EditSave } from "@/app/_components/EditSave";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/_types/ApiResponse/Product";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { productScheme } from "@/app/_libs/zod/schema";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { DeleteNotification } from "@/app/_libs/notifications/delete";
import { ErrorNotification } from "@/app/_libs/notifications/error";
import { SuccessNotification } from "@/app/_libs/notifications/success";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductIdEditPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const { id } = useParams();
  const router = useRouter();

  const { data: cateogries } = useFetch<Category[]>("/api/categories");
  const { data, error, isLoading } = useFetch<Product[]>(`/api/products/${id}`);

  const categoryArr = cateogries?.map((category: CategorySelect) => {
    return { value: category.id, label: category.name };
  });

  const categorySelect = [
    { value: "", label: "カテゴリなし" },
    ...(categoryArr ?? []),
  ];
  const form = useForm({
    initialValues: {
      product: "",
      categoryId: "",
    },
    validate: zodResolver(productScheme),
  });

  useEffect(() => {
    if (!data || !cateogries) return;
    form.setValues({
      product: data[0].name,
      categoryId: data[0].category?.id,
    });
  }, [data, cateogries]);

  const handleEdit = async (
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
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ product, categoryId: categoryId || null }),
        }
      );
      SuccessNotification({});
      router.push(`/products/${id}`);
    } catch (error) {
      ErrorNotification({ error });
    }
  };

  const handleDelte = () => {
    if (!token) return;
    DeleteNotification({
      endPoint: `api/products/${id}`,
      token,
      children: (
        <Text size="sm">商品を削除しますと、価格一覧も全て削除されます</Text>
      ),
      onSuccessPush: () => router.push(`/products/${id}`),
    });
  };
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <SkeltonBar />;
  }

  return (
    <Box>
      <Title size="h2">商品編集</Title>
      <form onSubmit={form.onSubmit(handleEdit)}>
        <TextInput
          size="md"
          radius="md"
          label="商品名"
          {...form.getInputProps("product")}
          disabled={form.submitting}
        />
        <NativeSelect
          size="md"
          radius="md"
          mt="lg"
          label="カテゴリー"
          {...form.getInputProps("categoryId")}
          data={categorySelect}
          disabled={form.submitting}
        />
        <EditSave submitting={form.submitting} />
      </form>
      <DeleteAnchor handleDelete={handleDelte} />
    </Box>
  );
};

export default ProductIdEditPage;
