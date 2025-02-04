"use client";

import { authSchema } from "@/app/_libs/zod/schema";
import { createUser } from "./action";
import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
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
      <form onSubmit={handleSubmit}>
        <div>
          <TextInput
            label="メールアドレス"
            type="email"
            name="email"
            id="email"
            required
            {...form.getInputProps("mail")}
            error={form.errors.mail}
          />
        </div>
        <div>
          <PasswordInput
            label="パスワード"
            type="password"
            name="password"
            id="password"
            required
            {...form.getInputProps("password")}
            error={form.errors.password}
          />
        </div>
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
