"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { nameScheme } from "@/app/_libs/zod/schema";
import { Category } from "@/app/_types/ApiResponse/Category";
import { Box, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";

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
    mode: "uncontrolled",
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

  const handleSave = async (
    _value: typeof form.values,
    e: FormEvent<HTMLFormElement> | undefined
  ) => {
    //typeof *** その型をコピーして持ってくる的な
    if (!token) return;
    e?.preventDefault();
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
    DeleteNotification({
      endPoint: `api/category/${id}`,
      token,
      onSuccessPush: () => router.push("/category"),
    });
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <SkeltonBar />;
  }

  return (
    <Box w="94%" mx="auto">
      <Title size="h2">カテゴリー編集</Title>
      <form onSubmit={form.onSubmit(handleSave)}>
        <TextInput
          size="md"
          radius="md"
          label="カテゴリー"
          name="name"
          {...form.getInputProps("name")}
          disabled={form.submitting}
        />

        <EditSave submitting={form.submitting} />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </Box>
  );
};

export default CategoryIdPage;
