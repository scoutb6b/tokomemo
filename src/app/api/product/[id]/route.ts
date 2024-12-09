import prisma from "@/_libs/prisma";
import { supabase } from "@/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export type productBodyProps = {
  product: string;
  categoryId: string;
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
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
  const { product, categoryId }: productBodyProps = body;
  const { id } = params;
  try {
    const item = await prisma.product.update({
      where: {
        id,
        user: {
          supabaseUserid,
        },
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
  { params }: { params: { id: string } }
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
  const { id } = params;
  try {
    await prisma.product.delete({
      where: {
        id,
        user: {
          supabaseUserid,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
