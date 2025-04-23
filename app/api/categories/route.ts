import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
