import prisma from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { Price } from "@/app/_types/ApiResponse/Price";
import { NextRequest, NextResponse } from "next/server";

type PriceStoreBody = {
  storeId: string;
  productId: string;
  price: number;
};

type PriceList = Omit<Price, "updatedAt">;

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const token = req.headers.get("Authorization") ?? "";
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  const supabaseUserid = data.user?.id;
  const { id } = await params;
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
    const { storeId, price }: PriceStoreBody = body;
    await prisma.price.create({
      data: {
        storeId,
        productId: id,
        price,
      },
    });
    return NextResponse.json({ message: "price成功" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
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
      { message: "登録しているユーザーから見つかりませんでした" },
      { status: 404 }
    );
  }
  const { id } = await params;

  try {
    const data = await prisma.price.findMany({
      where: {
        productId: id,
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
      },

      orderBy: {
        price: "asc",
      },
    });
    return NextResponse.json<PriceList[]>(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  }
};
