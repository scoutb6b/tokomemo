"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { nameScheme } from "@/app/_libs/zod/schema";
import { Store } from "@/app/_types/ApiResponse/Store";
import { TextInput } from "@mantine/core";
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
  console.log(form);

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
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/store/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          notifications.show({
            title: "完全に削除されました",
            message: "",
            autoClose: 2500,
            position: "bottom-right",
            color: "red",
          });
          router.push("/store");
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
    return <div>読み込み中...</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default StoreIdPage;
