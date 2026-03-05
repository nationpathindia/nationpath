import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req:Request){

const body = await req.json()

const {name,email,password,role} = body

const user = await prisma.user.create({
data:{
name,
email,
password,
role
}
})

return NextResponse.json(user)

}