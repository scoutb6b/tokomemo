import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { Price } from "@/app/_types/ApiResponse/Price";
import { NextRequest, NextResponse } from "next/server";

type PriceBody = {
  storeId: string;
  price: number;
  text: string;
};

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;
  const { priceId } = await params;
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
    const data = await prisma.price.findMany({
      where: {
        id: priceId,
        store: {
          userId: user.id,
        },
      },
      select: {
        id: true,
        price: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        text: true,
        updatedAt: true,
      },
    });
    return NextResponse.json<Price[]>(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;
  const { priceId } = await params;
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
    const body = await req.json();
    const { storeId, price, text }: PriceBody = body;
    const updatePrice = await prisma.price.update({
      where: {
        id: priceId,
        store: {
          userId: user.id,
        },
      },
      data: {
        storeId,
        price,
        text,
      },
    });

    return NextResponse.json({ price: updatePrice });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;
  const { priceId } = await params;
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
    await prisma.price.deleteMany({
      where: {
        id: priceId,
        store: {
          userId: user.id,
        },
      },
    });
    return NextResponse.json({ message: "priceId削除完了" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
