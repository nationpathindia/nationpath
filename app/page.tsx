import { prisma } from "@/lib/prisma"
import { PostStatus } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Home() {

let articles:any[] = []
let editorial:any[] = []
let horoscope:any[] = []
let flash:any[] = []

try{

articles = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
isEditorial:false,
isAstrology:false
},
include:{category:true},
orderBy:{createdAt:"desc"},
take:20
})

}catch(e){
console.log("articles error",e)
}

try{

editorial = await prisma.article.findMany({
where:{
status:"approved",
isEditorial:true,
isDeleted:false
},
orderBy:{createdAt:"desc"},
take:4
})

}catch(e){
console.log("editorial error",e)
}

try{

horoscope = await prisma.article.findMany({
where:{
status:"approved",
isAstrology:true,
isDeleted:false
},
take:12
})

}catch(e){
console.log("horoscope error",e)
}

try{

flash = await prisma.article.findMany({
where:{
flash:true,
status:"approved",
isDeleted:false
},
orderBy:{flashPriority:"desc"},
take:5
})

}catch(e){
console.log("flash error",e)
}

const hero = articles[0]

return(

<main className="max-w-6xl mx-auto p-6">

{/* FLASH NEWS */}

{flash.length>0 && (

<div className="bg-red-600 text-white p-2 mb-6">

<div className="flex gap-6 overflow-x-auto whitespace-nowrap">

{flash.map((f)=>(
<Link key={f.id} href={`/${f.slug}`}>
<span className="font-semibold">
⚡ {f.title}
</span>
</Link>
))}

</div>

</div>

)}

{/* HERO */}

{hero &&(

<div className="mb-10">

<Link href={`/${hero.slug}`}>

<h1 className="text-4xl font-bold mb-4">
{hero.title}
</h1>

</Link>

{hero.images?.[0] &&(

<Image
src={hero.images[0]}
alt={hero.title}
width={900}
height={500}
/>

)}

</div>

)}

{/* LATEST NEWS */}

<h2 className="text-2xl font-bold mb-6">
Latest News
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-12">

{articles.slice(1,10).map((a)=>(
<div key={a.id}>

<Link href={`/${a.slug}`}>
<h3 className="font-semibold text-lg">
{a.title}
</h3>
</Link>

</div>
))}

</div>

{/* EDITORIAL */}

{editorial.length>0 &&(

<div className="mb-12">

<h2 className="text-2xl font-bold mb-4">
Editorial
</h2>

{editorial.map((e)=>(
<div key={e.id}>
<Link href={`/editorial/${e.slug}`}>
{e.title}
</Link>
</div>
))}

</div>

)}

{/* HOROSCOPE */}

{horoscope.length>0 &&(

<div>

<h2 className="text-2xl font-bold mb-4">
Daily Horoscope
</h2>

<div className="grid grid-cols-3 md:grid-cols-6 gap-4">

{horoscope.map((h)=>(
<div key={h.id} className="border p-3 text-center">

<Link href={`/astrology/${h.slug}`}>
{h.zodiacSign}
</Link>

</div>
))}

</div>

</div>

)}

</main>

)

}