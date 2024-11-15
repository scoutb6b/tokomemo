"use client";

import { useState } from "react";
import { createUser } from "./action";

const SignUpPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUser(mail, password);
      setMail("");
      setPassword("");
      alert("認証メールを送信しました");
    } catch (error) {
      console.error(error);
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
