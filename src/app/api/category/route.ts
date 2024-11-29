import prisma from "@/_libs/prisma";
import { supabase } from "@/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user.id;
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
  const { category } = body;
  try {
    const data = await prisma.category.create({
      data: {
        name: category,
        userId: user.id,
      },
    });
    return NextResponse.json({
      message: "カテゴリー登録完了",
      status: 200,
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
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
    const data = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
    });
    console.log(data);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 402 });
    }
  }
};
