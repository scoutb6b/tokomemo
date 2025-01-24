import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { ProductMin } from "@/app/_types/ApiResponse/Product";
import { NextRequest, NextResponse } from "next/server";

export type ProductBody = {
  product: string;
  categoryId: string;
};

export const GET = async (req: NextRequest) => {
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

  if (!user) {
    return NextResponse.json(
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  try {
    const data = await prisma.product.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        price: {
          select: {
            id: true,
            price: true,
            store: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            price: "asc",
          },
          take: 1,
        },
      },
    });
    return NextResponse.json<ProductMin[]>(data);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 401 });
  }
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

  if (!user) {
    return NextResponse.json(
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  const body = await req.json();
  const { product, categoryId }: ProductBody = body;

  try {
    const data = await prisma.product.create({
      data: {
        name: product,
        userId: user.id,
        categoryId,
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
