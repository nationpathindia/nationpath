import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { PostStatus } from "@prisma/client"

export async function GET(){

const flash = await prisma.article.findMany({

where:{
status:PostStatus.approved,
isDeleted:false,
flash:true
},

orderBy:{
createdAt:"desc"
},

take:8,

include:{
category:true
}

})

return NextResponse.json(flash)

}