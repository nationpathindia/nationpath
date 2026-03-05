import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

const reporters = await prisma.user.findMany({

where:{ role:"reporter" },

include:{
articles:true
}

})

const data = reporters.map(r=>{

const totalViews = r.articles.reduce((sum,a)=>sum+a.views,0)

return{

id:r.id,
name:r.name,
email:r.email,
articles:r.articles.length,
views:totalViews,
avgViews: r.articles.length
? Math.round(totalViews/r.articles.length)
:0

}

})

return NextResponse.json(data)

}