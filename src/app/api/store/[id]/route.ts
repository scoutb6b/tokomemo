import prisma from "@/_libs/prisma";
import { supabase } from "@/_libs/supabase";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);
  console.log(token);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;

  const { id } = params;
  console.log("id", id);
  console.log("supa", supabaseUserid);

  try {
    const store = await prisma.store.findUnique({
      where: {
        id,
        user: {
          supabaseUserid,
        },
      },
      // select: {
      //   name: true,
      // },
    });
    console.log(store);

    return NextResponse.json({ store, message: "取得おk" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 401 });
  }
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

  const { id } = params;
  console.log(id);

  try {
    const body = await req.json();
    const { store } = body;
    console.log(store);

    const storeName = await prisma.store.update({
      where: {
        id,
        user: {
          supabaseUserid,
        },
      },
      data: {
        name: store,
      },
    });
    return NextResponse.json(
      { message: "store更新完了", store: storeName },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 401 });
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
  const { id } = params;
  try {
    await prisma.store.delete({
      where: {
        id,
        user: {
          supabaseUserid,
        },
      },
    });
    return NextResponse.json({ message: "store削除完了" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
