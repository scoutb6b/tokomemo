"use client";

import { supabase } from "@/app/_libs/supabase";
import {
  Box,
  Button,
  Group,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: mail,
      password,
    });
    if (error) {
      alert("ログイン失敗");
    } else {
      router.replace(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/product`);
    }
  };

  return (
    <Box w="94%" mx="auto">
      <form onSubmit={handleSubmit}>
        <Title size="h2">ログイン</Title>

        <TextInput
          mt={20}
          label="メールアドレス"
          type="email"
          name="email"
          id="email"
          required
          onChange={(e) => setMail(e.target.value)}
          value={mail}
        />

        <PasswordInput
          mt={10}
          label="パスワード"
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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
            ログイン
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginPage;
