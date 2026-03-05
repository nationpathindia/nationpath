import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const { senderId, receiverId, message } = body

if(!senderId || !receiverId || !message){

return NextResponse.json(
{error:"Missing fields"},
{status:400}
)

}

const chat = await prisma.chatMessage.create({

data:{
senderId,
receiverId,
message
}

})

return NextResponse.json(chat)

}