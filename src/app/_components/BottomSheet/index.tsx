"use client";

import { Button, Flex, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";
import c from "./index.module.css";
import { FormEventHandler, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { nameScheme } from "@/app/_libs/zod/schema";

type titleProps = {
  title: string;
  basePath: string;
  mutate: () => void;
};

export const BottomSheet = ({ title, basePath, mutate }: titleProps) => {
  const { token } = useSupabaseSession();
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: zodResolver(nameScheme),
  });
  const clickCreate: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!token) return;
    e.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { name } = form.getValues();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/${basePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name }),
      });
      form.reset();
      setIsOpen(false);
      mutate();
      notifications.show({
        title: `${title}が新しく追加されました`,
        message: "",
        autoClose: 2500,
        position: "bottom-right",
        color: "green",
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
  console.log(title);
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
          <form onSubmit={clickCreate} className={c.form}>
            <div className={c.handle}></div>
            <Title className={c.title}>{title}を追加する</Title>
            <Description />
            {/* ↑aria-describedbyが指定されていないための警告のため */}
            <TextInput
              size="md"
              radius="md"
              label=""
              name="name"
              {...form.getInputProps("name")}
            />
            <Button
              type="submit"
              variant="filled"
              size="md"
              color="green"
              className={c.addSubmit}
            >
              追加する
            </Button>
          </form>
        </Content>
      </Portal>
    </Root>
  );
};
