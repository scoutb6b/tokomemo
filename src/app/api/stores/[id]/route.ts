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
    const store = await prisma.store.findUnique({
      where: {
        id,
        userId: user.id,
      },
      // select: {
      //   name: true,
      // },
    });

    return NextResponse.json(store);
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 401 });
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
    const { store } = body;
    console.log(store);

    const storeName = await prisma.store.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        name: store,
      },
    });
    return NextResponse.json({ store: storeName });
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
    await prisma.store.delete({
      where: {
        id,
        userId: user.id,
      },
    });
    return NextResponse.json({ message: "store削除完了" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
