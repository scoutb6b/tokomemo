"use client";

import { authSchema } from "@/app/_libs/zod/schema";
import { createUser } from "./action";
import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { notifications } from "@mantine/notifications";
import { FormEvent } from "react";

const SignUpPage = () => {
  const form = useForm({
    initialValues: {
      mail: "",
      password: "",
    },
    validate: zodResolver(authSchema),
  });

  const handleSubmit = async (
    _value: typeof form.values,
    e: FormEvent<HTMLFormElement> | undefined
  ) => {
    e?.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { mail, password } = form.getValues();

    try {
      await createUser(mail, password);
      notifications.show({
        title: "メールが送信されましたので、ご確認ください",
        message: "右のXボタンにて閉じてください。",
        autoClose: false,
        color: "green",
        position: "top-center",
      });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "登録できませんでした",
        message: "",
        autoClose: 10000,
        color: "red",
        position: "top-center",
      });
    }
  };

  return (
    <Box w="94%" mx="auto">
      <Title size="h2">新規登録</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt={20}
          label="メールアドレス"
          type="email"
          name="email"
          id="email"
          {...form.getInputProps("mail")}
          error={form.errors.mail}
          disabled={form.submitting}
        />

        <PasswordInput
          mt={10}
          label="パスワード"
          type="password"
          name="password"
          id="password"
          description="6文字以上必須"
          {...form.getInputProps("password")}
          error={form.errors.password}
          disabled={form.submitting}
        />

        <Group justify="center" mt="md">
          <Button
            type="submit"
            variant="outline"
            color="orange"
            px="xl"
            size="md"
            radius="md"
            loading={form.submitting}
          >
            登録
          </Button>
        </Group>
      </form>
      <Box mt={40}>
        <Anchor href="/login" underline="always">
          <Text ta="center">ログインページはこちら</Text>
        </Anchor>
      </Box>
    </Box>
  );
};

export default SignUpPage;
