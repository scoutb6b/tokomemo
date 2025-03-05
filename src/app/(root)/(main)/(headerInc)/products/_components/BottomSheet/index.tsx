"use client";

import { Button, Flex, Text, Textarea, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";
import c from "./index.module.css";
import { FormEvent, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Store } from "@/app/_types/ApiResponse/Store";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { priceScheme } from "@/app/_libs/zod/schema";
import { ErrorNotification } from "@/app/_libs/notifications/error";
import { SuccessNotification } from "@/app/_libs/notifications/success";
import { StoreSelect } from "../StoreSelect";
import { usePrice } from "@/app/_hooks/usePrice";
import { FormState } from "@/app/_types/ApiResponse/Price";

type TitleProps = {
  title: string;
  basePath: string;
};
type StoreSelect = Pick<Store, "id" | "name">;

export const BottomSheet: React.FC<TitleProps> = ({ title, basePath }) => {
  const { token } = useSupabaseSession();
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const { mutate } = usePrice({ basePath });

  const form = useForm<FormState>({
    mode: "uncontrolled",
    initialValues: {
      storeId: "",
      price: "",
      memo: "",
    },
    validate: zodResolver(priceScheme),
  });

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
    const { storeId, price, memo } = form.getValues();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/${basePath}/price`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ storeId, price: Number(price), text: memo }),
        }
      );
      form.reset();
      setIsOpen(false);
      mutate();
      SuccessNotification({ title: "価格が追加されました" });
    } catch (error) {
      ErrorNotification({ error });
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
            <StoreSelect form={form} showChoice />
            <TextInput
              size="md"
              radius="md"
              mt="md"
              label="価格"
              name="price"
              type="number"
              inputMode="numeric"
              {...form.getInputProps("price")}
              disabled={form.submitting}
            />
            <Textarea
              size="md"
              radius="md"
              mt="md"
              label="メモ(任意)"
              placeholder="セール価格で購入"
              name="memo"
              {...form.getInputProps("memo")}
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
