"use client";

import { supabase } from "@/_libs/supabase";
import { useState } from "react";

const SignUpPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: mail,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    });
    if (error) {
      alert("登録失敗");
    } else {
      setMail("");
      setPassword("");
      alert("認証メールを送信しました");
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
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
