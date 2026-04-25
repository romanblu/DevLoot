import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(200),
    confirmPassword: z.string().min(8).max(200),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({ success: true, data: user }, { status: 201 });
}

