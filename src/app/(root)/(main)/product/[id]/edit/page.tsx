"use client";
import { NativeSelect, TextInput } from "@mantine/core";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent, useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { NextPage } from "next";
import { EditSave } from "@/app/_components/EditSave";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/_types/ApiResponse/Product";
import { notifications } from "@mantine/notifications";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { productScheme } from "@/app/_libs/zod/schema";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductIdEditPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const { id } = useParams();
  const router = useRouter();

  const { data: cateogries } = useFetch<Category[]>("/api/category");
  const { data, error, isLoading } = useFetch<Product[]>(`/api/product/${id}`);

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
    if (data) {
      form.setValues({
        product: data[0].name,
        categoryId: data[0].category?.id,
      });
    }
  }, [data]);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { product, categoryId } = form.getValues();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ product, categoryId: categoryId || null }),
      });
      notifications.show({
        title: "保存されました",
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "green",
      });
      router.push(`/product/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelte = () => {
    if (!token) return;
    modals.openConfirmModal({
      title: "削除後に戻すことは出来ません",
      centered: true,
      labels: { confirm: "削除する", cancel: "キャンセルする" },
      confirmProps: { color: "red" },
      onCancel: () =>
        notifications.show({
          title: "キャンセルしました",
          message: "",
          autoClose: 1500,
          position: "bottom-right",
          color: "gray",
        }),
      onConfirm: async () => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          notifications.show({
            title: "削除されました",
            message: "",
            autoClose: 2500,
            position: "bottom-right",
            color: "green",
          });
          router.push(`/product/${id}`);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <div>読み込み中</div>;
  }

  return (
    <div>
      <h1>商品編集</h1>
      <div>
        <form onSubmit={handleEdit}>
          <TextInput
            size="md"
            radius="md"
            label="商品名"
            {...form.getInputProps("product")}
          />
          <NativeSelect
            size="md"
            radius="md"
            mt="lg"
            label="カテゴリー"
            {...form.getInputProps("categoryId")}
            data={categorySelect}
          />
          <EditSave />
        </form>
        <DeleteAnchor handleDelete={handleDelte} />
      </div>
    </div>
  );
};

export default ProductIdEditPage;
