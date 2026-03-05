import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {

let articles:any[]=[]

try{

articles = await prisma.article.findMany({
where:{
status:PostStatus.approved,
isDeleted:false
},
orderBy:{createdAt:"desc"},
take:10
})

}catch(e){
console.log(e)
}

return(

<main className="max-w-6xl mx-auto p-10">

<h1 className="text-4xl font-bold mb-10">
Nation Path Test Homepage
</h1>

{articles.map(a=>(

<div key={a.id} className="mb-6 border-b pb-4">

<Link href="#">
<h2 className="text-xl font-semibold">
{a.title}
</h2>
</Link>

</div>

))}

</main>

)

}