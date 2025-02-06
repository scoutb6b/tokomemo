"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { nameScheme } from "@/app/_libs/zod/schema";
import { Store } from "@/app/_types/ApiResponse/Store";
import { Box, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";

const StoreIdPage: NextPage = () => {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data: store, error, isLoading } = useFetch<Store>(`/api/store/${id}`);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },
    validate: zodResolver(nameScheme),
  });
  useEffect(() => {
    if (store?.name) {
      form.setValues({ name: store?.name });
    }
  }, [store]);

  const handleSave = async (
    _value: typeof form.values,
    e: FormEvent<HTMLFormElement> | undefined
  ) => {
    if (!token) return;
    e?.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { name } = form.getValues();
    const storeName = {
      store: name,
    };
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/store/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(storeName),
      });
      router.push("/store");
      notifications.show({
        title: "保存されました",
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "green",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    if (!token) return;
    DeleteNotification({
      endPoint: `api/store/${id}`,
      token,
      onSuccessPush: () => router.push("/store"),
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
      <Title size="h2">お店編集</Title>
      <form onSubmit={form.onSubmit(handleSave)}>
        <TextInput
          size="md"
          radius="md"
          label="お店"
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

export default StoreIdPage;
