import prisma from "@/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const store = await prisma.store.findUnique({
      where: {
        id,
      },
    });
    return NextResponse.json({ store, message: "取得おk" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  console.log(id);

  try {
    const body = await req.json();
    const { store } = body;
    console.log(store);

    const storeName = await prisma.store.update({
      where: {
        id,
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
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    await prisma.store.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "store削除完了" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
