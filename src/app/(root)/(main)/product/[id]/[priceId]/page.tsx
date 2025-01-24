"use client";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Price } from "@/app/_types/ApiResponse/Price";
import { Store } from "@/app/_types/ApiResponse/Store";
import { NativeSelect, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const PriceIdPage: NextPage = () => {
  const { id, priceId } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const {
    data: amount,
    error,
    isLoading,
  } = useFetch<Price[] | undefined>(`/api/product/${id}/price/${priceId}`);
  const { data: stores } = useFetch<Store[] | undefined>("/api/store");

  const storeSelect = stores?.map((store) => {
    return { label: store.name, value: store.id };
  });

  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);

  console.log(amount);

  useEffect(() => {
    if (amount && amount.length > 0) {
      setPrice(amount[0].price);
      setStoreId(amount[0].store.id);
    }
  }, [amount]);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>...読み込み中</div>;
  }
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}/price/${priceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ storeId, price }),
        }
      );
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
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}/price/${priceId}`,
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
          router.push(`/product/${id}`);
          // router.back();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  return (
    <div>
      <form onSubmit={handleSave}>
        <NativeSelect
          size="md"
          radius="md"
          label="お店"
          value={storeId}
          onChange={(e) => setStoreId(e.currentTarget.value)}
          data={storeSelect}
        />
        <TextInput
          size="md"
          radius="md"
          mt="lg"
          label="価格"
          value={price ?? ""}
          onChange={(e) => setPrice(Number(e.currentTarget.value))}
          //あとでzod
        />

        <EditSave />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </div>
  );
};

export default PriceIdPage;
