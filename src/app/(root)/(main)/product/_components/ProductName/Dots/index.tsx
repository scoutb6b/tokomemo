import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { DeleteNotification } from "@/app/_libs/notifications/delete";
import {
  ActionIcon,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
} from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export const Dots = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { id } = useParams();
  const handleDelte = () => {
    if (!token) return;
    DeleteNotification({
      endPoint: `api/product/${id}`,
      token,
      children: (
        <Text size="sm">商品を削除しますと、価格一覧も全て削除されます</Text>
      ),
      onSuccessPush: () => router.push("/product"),
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
