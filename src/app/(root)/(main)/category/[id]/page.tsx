"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Category } from "@/app/_types/ApiResponse/Category";
import { TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
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
  const [name, setName] = useState("");

  useEffect(() => {
    if (cateogry?.name) {
      setName(cateogry?.name);
    }
  }, [cateogry]);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();
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
      <form onSubmit={(e) => handleSave}>
        <TextInput
          size="md"
          radius="md"
          label="カテゴリー"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <EditSave />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </div>
  );
};

export default CategoryIdPage;
