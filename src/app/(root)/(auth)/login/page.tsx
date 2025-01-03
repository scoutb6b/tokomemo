"use client";

import { supabase } from "@/app/_libs/supabase";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
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
      router.replace(`${process.env.API_URL}/product`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextInput
            label="メールアドレス"
            type="email"
            name="email"
            id="email"
            required
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          />
        </div>
        <div>
          <PasswordInput
            label="パスワード"
            type="password"
            name="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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
            ログイン
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default LoginPage;
