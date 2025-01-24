import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import {
  ActionIcon,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export const Dots = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { id } = useParams();
  const handleDelte = () => {
    if (!token) return;
    modals.openConfirmModal({
      title: "削除後に戻すことは出来ません",
      children: (
        <Text size="sm">商品を削除しますと、価格一覧も全て削除されます</Text>
      ),
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
            title: "完全に削除されました",
            message: "",
            autoClose: 2500,
            position: "bottom-right",
            color: "red",
          });
          router.push("/product");
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <Menu shadow="xl" width={200}>
      <MenuTarget>
        <ActionIcon color="gray" variant="white">
          <IconDotsVertical stroke={2} />
        </ActionIcon>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={<IconEdit />}
          component={Link}
          href={`/product/${id}/edit`}
        >
          商品情報を編集する
        </MenuItem>
        <MenuItem color="red" leftSection={<IconTrash />} onClick={handleDelte}>
          商品情報を削除する
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
