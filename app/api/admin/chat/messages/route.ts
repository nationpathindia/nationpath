import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){

const senderId = req.nextUrl.searchParams.get("sender")
const receiverId = req.nextUrl.searchParams.get("receiver")

if(!senderId || !receiverId){

return NextResponse.json(
{error:"Missing users"},
{status:400}
)

}

const messages = await prisma.chatMessage.findMany({

where:{
OR:[
{ senderId, receiverId },
{ senderId:receiverId, receiverId:senderId }
]
},

orderBy:{
createdAt:"asc"
},

include:{
sender:{
select:{
name:true,
email:true
}
}
}

})

return NextResponse.json(messages)

}