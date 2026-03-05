import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {

    /* ================= SAFE BODY PARSE ================= */

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, email, password, role } = body;

    /* ================= VALIDATION ================= */

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    /* ================= CHECK EXISTING USER ================= */

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    /* ================= HASH PASSWORD ================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= ROLE SAFETY ================= */

    const allowedRoles = ["admin", "editor", "reporter"];
    const safeRole = allowedRoles.includes(role) ? role : "admin";

    /* ================= CREATE USER ================= */

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: safeRole,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed"
      },
      { status: 500 }
    );

  }
}