import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request){

try{

const body = await req.json()

const { name,email,message } = body

if(!message){

return NextResponse.json(
{error:"Message required"},
{status:400}
)

}

const chat = await prisma.visitorChat.create({

data:{
name,
email,
message
}

})

return NextResponse.json(chat)

}catch(error){

console.error(error)

return NextResponse.json(
{error:"Failed"},
{status:500}
)

}

}