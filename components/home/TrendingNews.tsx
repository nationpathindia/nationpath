"use client"

import { useEffect, useState } from "react"

type Article = {
  id:string
  title:string
  slug:string
}

export default function TrendingNews(){

const [news,setNews] = useState<Article[]>([])

useEffect(()=>{

fetch("/api/trending")
.then(res=>res.json())
.then(setNews)

},[])

return(

<section className="max-w-7xl mx-auto px-6 mt-16">

<h2 className="text-xl font-bold mb-6 border-b pb-2">
🔥 Trending Now
</h2>

<div className="grid md:grid-cols-3 gap-6">

{news.slice(0,6).map((n)=>(

<a
key={n.id}
href={`/article/${n.slug}`}
className="hover:text-orange-500 transition"
>

<h3 className="font-semibold leading-snug">
{n.title}
</h3>

</a>

))}

</div>

</section>

)

}