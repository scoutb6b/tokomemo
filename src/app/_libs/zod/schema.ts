import { z } from "zod";

export const authSchema = z.object({
  mail: z.string().email({ message: "正しいメールアドレスの形式にして下さい" }),
  password: z.string().min(6, {
    message: "6文字以上で入力してください。",
  }),
});

export const nameScheme = z.object({
  name: z.string().min(1, { message: "入力は必須です" }),
});
export const productScheme = z.object({
  product: z.string().min(1, { message: "入力は必須です" }),
  categoryId: z.string().optional(),
});
export const priceScheme = z.object({
  storeId: z.string().min(1, { message: "お店を選択ください" }),
  price: z.coerce.number().positive({ message: "1円以上で登録してください" }),
  memo: z.string().max(40, { message: "40文字以内で入力してください" }),
});
