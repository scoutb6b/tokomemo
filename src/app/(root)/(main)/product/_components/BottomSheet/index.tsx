"use client";

import { Button, Flex, NativeSelect, Text, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Drawer } from "vaul";
import c from "./index.module.css";
import { FormEventHandler, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { notifications } from "@mantine/notifications";
import { useFetch } from "@/app/_hooks/useFetch";
import { Store } from "@/app/_types/ApiResponse/Store";

type titleProps = {
  title: string;
  basePath: string;
  mutate: () => void;
};
type StoreSelect = Pick<Store, "id" | "name">;

export const BottomSheet = ({ title, basePath, mutate }: titleProps) => {
  const { token } = useSupabaseSession();
  const [storeId, setStoreId] = useState("");
  const [price, setPrice] = useState("");
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  const { data: stores } = useFetch<Store[]>("/api/store");

  const storeSelect = stores?.map((store: StoreSelect) => {
    return { value: store.id, label: store.name };
  });

  const clickCreate: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!token) return;

    e.preventDefault();
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
          //priceはzodでnumberのバリデーションを行う
        }
      );
      setPrice("");
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
          <form onSubmit={clickCreate} className={c.form}>
            <div className={c.handle}></div>
            <Title className={c.title}>{title}を追加する</Title>
            <Description />
            {/* ↑aria-describedbyが指定されていないための警告のため */}
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
              value={price}
              onChange={(e) => setPrice(e.currentTarget.value)}
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
