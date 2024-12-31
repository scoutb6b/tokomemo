import prisma from "@/_libs/prisma";
import { supabase } from "@/_libs/supabase";
import { Store } from "@/_types/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization") ?? "";
  console.log(token);

  const { data, error } = await supabase.auth.getUser(token);
  console.log(data);

  if (error) {
    console.log(error);

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
  try {
    const body = await req.json();
    const { name } = body;
    console.log(body);

    const data = await prisma.store.create({
      data: {
        name,
        userId: user.id,
      },
    });
    console.log(data);

    return NextResponse.json({
      status: 500,
      message: "お店登録完了",
      data,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);

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
    const data = await prisma.store.findMany({
      where: {
        userId: user.id,
      },
    });
    console.log(data);

    return NextResponse.json<Store[]>(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 402 });
    }
  }
};
