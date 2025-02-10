"use client";

import { authSchema } from "@/app/_libs/zod/schema";
import { createUser } from "./action";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

const SignUpPage = () => {
  const form = useForm({
    initialValues: {
      mail: "",
      password: "",
    },
    validate: zodResolver(authSchema),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.validate().hasErrors) {
      console.error("バリデーションエラー");
      return;
    }
    const { mail, password } = form.getValues();
    try {
      await createUser(mail, password);
      alert("認証メールを送信しました");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box w="94%" mx="auto">
      <Title size="h2">新規登録</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          mt={20}
          label="メールアドレス"
          type="email"
          name="email"
          id="email"
          required
          {...form.getInputProps("mail")}
          error={form.errors.mail}
        />

        <PasswordInput
          mt={10}
          label="パスワード"
          type="password"
          name="password"
          id="password"
          required
          {...form.getInputProps("password")}
          error={form.errors.password}
        />

        <Group justify="center" mt="md">
          <Button
            type="submit"
            variant="outline"
            color="orange"
            px="xl"
            size="md"
            radius="md"
          >
            登録
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default SignUpPage;
