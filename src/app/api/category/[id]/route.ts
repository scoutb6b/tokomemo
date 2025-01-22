import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

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
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    return NextResponse.json(category);
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
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  const { id } = await params;

  try {
    const body = await req.json();
    const { category } = body;

    const categoryName = await prisma.category.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: category,
      },
    });
    return NextResponse.json({ category: categoryName });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 401 });
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
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }

  const { id } = await params;
  try {
    await prisma.category.delete({
      where: {
        id,
        userId: user.id,
      },
    });
    return NextResponse.json({ message: "category削除完了" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
