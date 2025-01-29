"use client";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { priceScheme } from "@/app/_libs/zod/schema";
import { Price } from "@/app/_types/ApiResponse/Price";
import { Store } from "@/app/_types/ApiResponse/Store";
import { NativeSelect, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "mantine-form-zod-resolver";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect } from "react";

const PriceIdPage: NextPage = () => {
  const { id, priceId } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const {
    data: amount,
    error,
    isLoading,
  } = useFetch<Price[]>(`/api/product/${id}/price/${priceId}`);
  const { data: stores } = useFetch<Store[]>("/api/store");

  const form = useForm<{ storeId: string | null; price: number | null }>({
    initialValues: {
      storeId: null,
      price: null,
    },
    validate: zodResolver(priceScheme),
  });

  const storeSelect = stores?.map((store) => {
    return { label: store.name, value: store.id };
  });
  useEffect(() => {
    if (amount && amount.length > 0) {
      form.setValues({
        storeId: amount[0].store.id,
        price: amount[0].price,
      });
    }
  }, [amount]);
  console.log(amount);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <div>...読み込み中</div>;
  }
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { storeId, price } = form.getValues();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}/price/${priceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ storeId, price: Number(price) }),
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
          {...form.getInputProps("storeId")}
          data={storeSelect}
        />
        <TextInput
          size="md"
          radius="md"
          mt="lg"
          label="価格"
          type="number"
          inputMode="numeric"
          {...form.getInputProps("price")}
        />

        <EditSave />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </div>
  );
};

export default PriceIdPage;
