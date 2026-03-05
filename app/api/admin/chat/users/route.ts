import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const users = await prisma.user.findMany({

where:{
isActive:true
},

select:{
id:true,
name:true,
email:true,
role:true,
avatar:true
},

orderBy:{
name:"asc"
}

})

return NextResponse.json(users)

}