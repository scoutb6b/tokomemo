"use client";
import { NativeSelect, TextInput } from "@mantine/core";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@/app/_types/ApiResponse/Category";
import { FormEvent, useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { NextPage } from "next";
import { EditSave } from "@/app/_components/EditSave";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/_types/ApiResponse/Product";
import { notifications } from "@mantine/notifications";
import { DeleteAnchor } from "@/app/_components/DeleteAnchor";
import { modals } from "@mantine/modals";

type CategorySelect = Pick<Category, "id" | "name">;

const ProductIdEditPage: NextPage = () => {
  const { token } = useSupabaseSession();
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const { data: cateogries } = useFetch<Category[]>("/api/category");
  const { data, error, isLoading } = useFetch<Product>(`/api/product/${id}`);

  const categoryArr = cateogries?.map((category: CategorySelect) => {
    return { value: category.id, label: category.name };
  });

  const categorySelect = [
    { value: "", label: "カテゴリなし" },
    ...(categoryArr ?? []),
  ];
  useEffect(() => {
    if (data) {
      setProduct(data.name);
      setCategoryId(data.category?.id);
    }
  }, [data]);

  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    if (!token) return;
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ product, categoryId }),
      });
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

  const handleDelte = () => {
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
            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/product/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          notifications.show({
            title: "削除されました",
            message: "",
            autoClose: 2500,
            position: "bottom-right",
            color: "green",
          });
          router.push(`/product/${id}`);
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
    return <div>読み込み中</div>;
  }

  return (
    <div>
      <h1>商品編集</h1>
      <div>
        <form onSubmit={handleEdit}>
          <TextInput
            size="md"
            radius="md"
            label="商品名"
            value={product}
            onChange={(e) => setProduct(e.currentTarget.value)}
          />
          <NativeSelect
            size="md"
            radius="md"
            mt="lg"
            label="カテゴリー"
            value={categoryId}
            onChange={(e) => setCategoryId(e.currentTarget.value)}
            data={categorySelect}
          />
          <EditSave />
        </form>
        <DeleteAnchor handleDelete={handleDelte} />
      </div>
    </div>
  );
};

export default ProductIdEditPage;
