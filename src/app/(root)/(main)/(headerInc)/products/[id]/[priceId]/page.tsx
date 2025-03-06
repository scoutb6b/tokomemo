"use client";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { EditSave } from "@/app/_components/EditSave";
import { SkeltonBar } from "@/app/_components/Skelton/Bar";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { DeleteNotification } from "@/app/_libs/notifications/delete";
import { ErrorNotification } from "@/app/_libs/notifications/error";
import { SuccessNotification } from "@/app/_libs/notifications/success";
import { priceScheme } from "@/app/_libs/zod/schema";
import { FormState, Price } from "@/app/_types/ApiResponse/Price";
import { TextInput, Title, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { StoreSelect } from "../../_components/StoreSelect";
import { BackButton } from "@/app/_components/BackButton";

const PriceIdPage: NextPage = () => {
  const { id, priceId } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [updatedDate, setUpdatedDate] = useState<string | undefined>("");

  const { data, error, isLoading } = useFetch<Price[]>(
    `/api/products/${id}/price/${priceId}`
  );

  const form = useForm<FormState>({
    initialValues: {
      storeId: "",
      price: 0,
      memo: "",
    },
    validate: zodResolver(priceScheme),
  });
  useEffect(() => {
    if (!data) return;
    form.setValues({
      storeId: data[0].store.id,
      price: data[0].price,
      memo: data[0].text,
    });
    if (data && data.length > 0) {
      setUpdatedDate(new Date(data[0].updatedAt).toISOString().split("T")[0]);
    }
  }, [data]);

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
    const { storeId, price, memo } = form.getValues();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/products/${id}/price/${priceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ storeId, price: Number(price), text: memo }),
        }
      );
      SuccessNotification({});
      router.push(`/products/${id}`);
    } catch (error) {
      ErrorNotification({ error });
    }
  };

  const handleDelete = () => {
    if (!token) return;
    DeleteNotification({
      endPoint: `api/products/${id}/price/${priceId}`,
      token,
      onSuccessPush: () => router.push(`/products/${id}`),
    });
  };
  return (
    <>
      <BackButton path={id as string} />
      <Title size="h2">価格編集</Title>
      <form onSubmit={form.onSubmit(handleSave)}>
        <StoreSelect form={form} showChoice={false} />
        <TextInput
          size="md"
          radius="md"
          mt="md"
          label="価格"
          type="number"
          inputMode="numeric"
          {...form.getInputProps("price")}
          // value={form.getValues().price ?? null}
          // onChange={(e) => form.setFieldValue("price", e.currentTarget.value)}
          disabled={form.submitting}
        />
        <Textarea
          size="md"
          radius="md"
          mt="md"
          label="メモ(任意)"
          name="memo"
          {...form.getInputProps("memo")}
          disabled={form.submitting}
        />
        <Text size="sm" ta="right" c="gray">
          最終更新日: {updatedDate}
        </Text>
        <EditSave submitting={form.submitting} />
      </form>
      <DeleteAnchor handleDelete={handleDelete} />
    </>
  );
};

export default PriceIdPage;
