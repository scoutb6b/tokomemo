"use client";

import { Button, Flex, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";
import c from "./index.module.css";
import { FormEventHandler, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";

type titleProps = {
  title: string;
  basePath: string;
  mutate: () => void;
};

export const BottomSheet = ({ title, basePath, mutate }: titleProps) => {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  const clickCreate: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!token) return;

    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/${basePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name }),
      });
      // window.location.reload();
      setName("");
      // router.refresh()
      setIsOpen(false);
      mutate();
    } catch (error) {
      console.log(error);
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
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
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
