"use client";

import { Button, Flex, NativeSelect, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";
import c from "./index.module.css";
import { FormEvent, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { notifications } from "@mantine/notifications";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { priceScheme } from "@/app/_libs/zod/schema";

type titleProps = {
  title: string;
  basePath: string;
  mutate: () => void;
};
type StoreSelect = Pick<Store, "id" | "name">;

export const BottomSheet = ({ title, basePath, mutate }: titleProps) => {
  const { token } = useSupabaseSession();
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  const { data: stores } = useFetch<Store[]>("/api/store");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      storeId: "",
      price: "",
    },
    validate: zodResolver(priceScheme),
  });

  const storeArr =
    stores && stores.length > 0
      ? stores.map((store: StoreSelect) => ({
          value: store.id,
          label: store.name,
        }))
      : [];

  const storeSelect = [{ value: "", label: "選択してください" }, ...storeArr];

  const clickCreate = async (
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
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/${basePath}/price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ storeId, price: Number(price) }),
        }
      );
      form.reset();
      setIsOpen(false);
      mutate();
      notifications.show({
        title: "新しく追加されました",
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "white",
        style: { background: "green" },
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
  };
  const { Root, Trigger, Description, Overlay, Portal, Content, Title } =
    Drawer;

  return (
    <Root open={isOpen} onOpenChange={setIsOpen}>
      <Trigger className={c.trigger}>
        <Flex gap="xs">
          <IconPlus size={28} stroke={1.5} />
          <Text fz="lg">追加する</Text>
        </Flex>
      </Trigger>
      <Portal>
        <Overlay className={c.overlay} />
        <Content className={c.content}>
          <form onSubmit={form.onSubmit(clickCreate)} className={c.form}>
            <div className={c.handle}></div>
            <Title className={c.title}>{title}を追加する</Title>
            <Description />
            {/* ↑aria-describedbyが指定されていないための警告のため */}
            <NativeSelect
              size="md"
              radius="md"
              label="お店"
              name="storeId"
              {...form.getInputProps("storeId")}
              data={storeSelect}
              disabled={form.submitting}
            />

            <TextInput
              size="md"
              radius="md"
              mt="lg"
              label="価格"
              name="price"
              type="number"
              inputMode="numeric"
              {...form.getInputProps("price")}
              disabled={form.submitting}
            />
            <Button
              type="submit"
              variant="filled"
              size="md"
              color="green"
              className={c.addSubmit}
              loading={form.submitting}
            >
              追加する
            </Button>
          </form>
        </Content>
      </Portal>
    </Root>
  );
};
