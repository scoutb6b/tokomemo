import { z } from "zod";

export const authSchema = z.object({
  mail: z.string().email({ message: "正しいメールアドレスの形式にして下さい" }),
  password: z.string().min(6, {
    message: "6文字以上で入力してください。",
  }),
});
