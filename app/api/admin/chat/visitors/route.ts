import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const messages = await prisma.visitorChat.findMany({

orderBy:{
createdAt:"desc"
},

take:50

})

return NextResponse.json(messages)

}