"use client";

import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { NativeSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type CategorySelect = Pick<Category, "id" | "name">;
type Props = {
  form: UseFormReturnType<{ product: string; categoryId: string }>;
};

export const CategorySelect: React.FC<Props> = ({ form }) => {
  const { data, error } = useFetch<Category[]>("/api/categories");

  const categoryArr =
    data && data.length > 0
      ? data.map((category: CategorySelect) => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  const categorySelect = [{ value: "", label: "カテゴリなし" }, ...categoryArr];
  if (error) {
    return <div>カテゴリー取得エラー：{error.message}</div>;
  }
  return (
    <NativeSelect
      size="md"
      radius="md"
      mt="lg"
      label="カテゴリー"
      {...form.getInputProps("categoryId")}
      data={categorySelect}
      disabled={form.submitting}
    />
  );
};
