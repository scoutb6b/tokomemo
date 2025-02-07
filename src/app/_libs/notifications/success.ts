import { notifications } from "@mantine/notifications";
import c from "./index.module.css";

type Props = {
  title?: string;
};

export const SuccessNotification = ({ title }: Props) => {
  notifications.show({
    title: title ?? "保存されました",
    message: "",
    autoClose: 3000,
    position: "bottom-right",
    classNames: {
      root: c.success,
      title: c.successTitle,
      closeButton: c.successCloseBtn,
    },
  });
};
