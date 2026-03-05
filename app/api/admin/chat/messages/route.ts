import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const senderId = req.nextUrl.searchParams.get("sender");
    const receiverId = req.nextUrl.searchParams.get("receiver");

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "Missing sender or receiver" },
        { status: 400 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },

      orderBy: {
        createdAt: "asc",
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Chat messages error:", error);

    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}