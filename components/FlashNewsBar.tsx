import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import Link from "next/link";

export default async function FlashNewsBar() {

let flash:any[]=[]

try{

flash = await prisma.article.findMany({
where:{
status:PostStatus.approved,
isDeleted:false,
flash:true
},
include:{category:true},
orderBy:{flashPriority:"desc"},
take:10
})

}catch(e){}

if(!flash.length) return null

return(

<div className="w-full mb-6">

<div className="flex w-full overflow-hidden rounded-sm border">

{/* LEFT LABEL */}

<div className="bg-[#2c4c72] text-white font-bold px-6 py-3 tracking-wider text-sm md:text-base">

FLASH NEWS

</div>

{/* TICKER */}

<div className="flex-1 bg-gray-100 overflow-hidden">

<div className="ticker flex items-center gap-12 whitespace-nowrap px-6 py-3 text-gray-900 font-medium text-sm md:text-base">

{flash.map(item=>(

<Link
key={item.id}
href={`/${item.category?.slug}/${item.slug}`}
className="hover:text-blue-700 transition"
>

{item.title}

</Link>

))}

</div>

</div>

</div>

</div>

)

}