import { notifications } from "@mantine/notifications";
import c from "./index.module.css";
type Props = {
  error: Error | unknown;
};

export const ErrorNotification = ({ error }: Props) => [
  notifications.show({
    title: "エラーが発生しました",
    message: `${error}`,
    autoClose: false,
    position: "bottom-right",
    classNames: {
      root: c.error,
      title: c.errorTitle,
      closeButton: c.errorCloseBtn,
    },
  }),
];
