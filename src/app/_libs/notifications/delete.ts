import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import "../../globals.css";
import c from "./index.module.css";
import { ReactNode } from "react";

type Props = {
  endPoint: string;
  token: string;
  children?: ReactNode;
  onSuccessPush: () => void;
};

export const DeleteNotification = ({
  endPoint,
  token,
  children,
  onSuccessPush,
}: Props) => {
  modals.openConfirmModal({
    title: "削除後に戻すことは出来ません",
    children,
    centered: true,
    labels: { confirm: "削除する", cancel: "キャンセルする" },
    confirmProps: { color: "red" },
    onCancel: () =>
      notifications.show({
        title: "キャンセルしました",
        message: "",
        autoClose: 2000,
        position: "bottom-right",
        classNames: {
          root: c.cancel,
          title: c.cancelTitle,
          closeButton: c.cancelCloseBtn,
        },
      }),
    onConfirm: async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/${endPoint}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        notifications.show({
          title: "完全に削除されました",
          message: "",
          autoClose: 3000,
          position: "bottom-right",
          classNames: {
            root: c.delete,
            title: c.deleteTitle,
            closeButton: c.deleteCloseBtn,
          },
        });
        onSuccessPush();
      } catch (error) {
        console.error(error);
      }
    },
  });
};
