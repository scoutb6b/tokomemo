import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { Product } from "@/app/_types/ApiResponse/Product";
import { NextRequest, NextResponse } from "next/server";

export type ProductBody = {
  product: string;
  categoryId: string;
};
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
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
      { message: "userが見つかりませんでした" },
      { status: 404 }
    );
  }

  const { id } = await params;
  try {
    const data = await prisma.product.findMany({
      where: {
        id,
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
      },
    });
    return NextResponse.json<Product[]>(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
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
      { message: "userが見つかりませんでした" },
      { status: 404 }
    );
  }
  const body = await req.json();
  const { product, categoryId }: ProductBody = body;
  const { id } = await params;
  try {
    const item = await prisma.product.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: product,
        categoryId,
      },
    });
    return NextResponse.json({ message: "product更新完了", item });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
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
      { message: "userが見つかりませんでした" },
      { status: 404 }
    );
  }
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: {
        id,
        userId: user.id,
      },
    });
    return NextResponse.json({ message: "商品削除完了" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
