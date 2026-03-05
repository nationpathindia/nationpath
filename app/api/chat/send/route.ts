import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const { name, email, message } = body;

    /* ================= VALIDATION ================= */

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message required" },
        { status: 400 }
      );
    }

    /* ================= CREATE CHAT ================= */

    const chat = await prisma.visitorChat.create({
      data: {
        name: name?.trim() || "Visitor",
        email: email?.trim() || null,
        message: message.trim()
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      chat
    });

  } catch (error) {

    console.error("CHAT SEND ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message"
      },
      { status: 500 }
    );

  }

}