"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { nameScheme } from "@/app/_libs/zod/schema";
import { Category } from "@/app/_types/ApiResponse/Category";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const CategoryIdPage: NextPage = () => {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const {
    data: cateogry,
    error,
    isLoading,
  } = useFetch<Category>(`/api/category/${id}`);

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: zodResolver(nameScheme),
  });

  useEffect(() => {
    if (cateogry?.name) {
      form.setValues({ name: cateogry?.name });
    }
  }, [cateogry]);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { name } = form.getValues();
    const categoryName = {
      category: name,
    };
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/category/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(categoryName),
        }
      );
      notifications.show({
        title: "保存されました",
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "green",
      });
      router.push("/category");
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

  const handleDelete = () => {
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
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/category/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          router.push("/category");
          notifications.show({
            title: "完全に削除されました",
            message: "",
            autoClose: 2500,
            position: "bottom-right",
            color: "red",
          });
        } catch (error) {
          notifications.show({
            title: "エラーが発生しました",
            message: `${error}`,
            autoClose: 2500,
            position: "bottom-right",
            color: "red",
          });
        }
      },
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1>カテゴリー編集</h1>
      <form onSubmit={handleSave}>
        <TextInput
          size="md"
          radius="md"
          label="カテゴリー"
          name="name"
          {...form.getInputProps("name")}
        />

        <EditSave />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </div>
  );
};

export default CategoryIdPage;
