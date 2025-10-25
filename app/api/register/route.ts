// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; // 解构请求体

    // 1. 检查用户是否已存在
    // 其中的 prisma.user 指的是在 schema.prisma 中定义的model，也就是名为User的model
    // https://www.prisma.io/docs/orm/prisma-client/queries/crud
    const existingUser = await prisma.user.findUnique({
      // 在User表中查找一条基于"唯一"字段匹配的记录，传入的 where 必须使用一个或多个被定义为唯一的字段
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 创建新用户
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { user: newUser.email, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/register error:", error);
    return NextResponse.json(
      { message: (error as Error)?.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
