"use server";

import prisma from "@/_libs/prisma";
import { supabase } from "@/_libs/supabase";

export const createUser = async (mail: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: mail,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/login`,
    },
  });
  if (error) {
    throw new Error("サインアップ失敗");
  }

  const supabaseUserid = data.user?.id;
  console.log(supabaseUserid);

  if (supabaseUserid) {
    try {
      await prisma.user.create({
        data: {
          supabaseUserid,
        },
      });
    } catch (error) {
      console.error("テーブル登録エラー:", error);
      throw new Error("Userテーブルへの登録に失敗しました");
    }
  }
};
