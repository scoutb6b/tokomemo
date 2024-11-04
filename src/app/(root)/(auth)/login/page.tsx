"use client";

import { supabase } from "@/_libs/supabase";
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
      router.replace("http://localhost:3000/");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            onChange={(e) => setMail(e.target.value)}
            value={mail}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <button type="submit">ログイン</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
