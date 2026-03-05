import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {

let articles:any[] = []
let flash:any[] = []

try{

articles = await prisma.article.findMany({
where:{
status:PostStatus.approved,
isDeleted:false
},
include:{category:true},
orderBy:{createdAt:"desc"},
take:20
})

}catch(e){
console.log(e)
}

try{

flash = await prisma.article.findMany({
where:{
flash:true,
status:PostStatus.approved,
isDeleted:false
},
orderBy:{flashPriority:"desc"},
take:5
})

}catch(e){
console.log(e)
}

const hero = articles?.[0] || null
const latest = articles?.slice(1) || []

function articleUrl(article:any){
if(!article?.category?.slug) return "#"
return `/${article.category.slug}/${article.slug}`
}

return(

<main className="max-w-6xl mx-auto px-4 pt-8">

{/* FLASH NEWS */}

{flash.length>0 &&(

<div className="bg-red-600 text-white p-2 mb-8">

<div className="flex gap-6 overflow-x-auto whitespace-nowrap">

{flash.map((f)=>(
<Link key={f.id} href={articleUrl(f)}>
<span className="font-semibold">
⚡ {f.title}
</span>
</Link>
))}

</div>

</div>

)}

{/* HERO ARTICLE */}

{hero &&(

<section className="mb-12">

<Link href={articleUrl(hero)}>

<h1 className="text-4xl font-bold mb-4">
{hero.title}
</h1>

</Link>

{hero?.images && hero.images.length>0 &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={900}
height={500}
/>

)}

</section>

)}

{/* ALL NEWS */}

<section>

<h2 className="text-2xl font-bold mb-6">
Latest News
</h2>

<div className="space-y-6">

{latest.map((article)=>(
<div key={article.id}>

<Link href={articleUrl(article)}>

<h3 className="text-lg font-semibold hover:text-blue-700">
{article.title}
</h3>

</Link>

</div>
))}

</div>

</section>

</main>

)

}