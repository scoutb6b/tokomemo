"use client";

import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Store } from "@/app/_types/ApiResponse/Store";
import { TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";

const StoreIdPage: NextPage = () => {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const { data: store, error, isLoading } = useFetch<Store>(`/api/store/${id}`);
  const [name, setName] = useState("");

  useEffect(() => {
    if (store?.name) {
      setName(store?.name);
    }
  }, [store]);

  const handleSave: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!token) return;
    e.preventDefault();
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
    return (
      <div>
        `store/{id}の{error.message}`
      </div>
    );
  }
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSave}>
        <TextInput
          size="md"
          radius="md"
          label="お店"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <EditSave />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </div>
  );
};

export default StoreIdPage;
