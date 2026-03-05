import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { senderId, receiverId, message } = body

    if (!senderId || !receiverId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        senderId,
        receiverId,
        message
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error("Chat send error:", error)

    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}