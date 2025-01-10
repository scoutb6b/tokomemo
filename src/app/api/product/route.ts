import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export type productBody = {
  product: string;
  categoryId: string;
};

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;
  const user = await prisma.user.findUnique({
    where: {
      supabaseUserid,
    },
  });
  console.log(user);

  if (!user) {
    return NextResponse.json(
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  const body = await req.json();
  const { product, categoryId }: productBody = body;

  try {
    const item = await prisma.product.create({
      // where:{
      //   userId:user,
      //   category:{
      //     id:categoryId
      //   },
      // },
      data: {
        name: product,
        userId: user.id,
        categoryId,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
