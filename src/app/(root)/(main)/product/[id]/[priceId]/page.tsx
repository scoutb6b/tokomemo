"use client";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { priceScheme } from "@/app/_libs/zod/schema";
import { Price } from "@/app/_types/ApiResponse/Price";
import { Store } from "@/app/_types/ApiResponse/Store";
import { Box, NativeSelect, TextInput, Title } from "@mantine/core";
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
    mode: "uncontrolled",
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
    return <SkeltonBar />;
  }
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
      SuccessNotification({});
      router.push(`/product/${id}`);
    } catch (error) {
      ErrorNotification({ error });
    }
  };

  const handleDelete = () => {
    if (!token) return;
    DeleteNotification({
      endPoint: `api/product/${id}/price/${priceId}`,
      token,
      onSuccessPush: () => router.push(`/product/${id}`),
    });
  };
  return (
    <Box>
      <Title size="h2">価格編集</Title>
      <form onSubmit={form.onSubmit(handleSave)}>
        <NativeSelect
          size="md"
          radius="md"
          label="お店"
          {...form.getInputProps("storeId")}
          data={storeSelect}
          disabled={form.submitting}
        />
        <TextInput
          size="md"
          radius="md"
          mt="lg"
          label="価格"
          type="number"
          inputMode="numeric"
          {...form.getInputProps("price")}
          disabled={form.submitting}
        />

        <EditSave submitting={form.submitting} />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </Box>
  );
};

export default PriceIdPage;
