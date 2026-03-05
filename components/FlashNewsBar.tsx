"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Article = {
  id: string
  title: string
  slug: string
  category?: { slug: string }
}

export default function FlashNewsBar() {

  const [news, setNews] = useState<Article[]>([])

  useEffect(() => {
    fetch("/api/flash")
      .then(res => res.json())
      .then(setNews)
  }, [])

  if (news.length === 0) return null

  return (

    <div className="bg-gray-100 border-y">

      <div className="max-w-7xl mx-auto flex items-center h-10">

        {/* LABEL */}

        <div className="bg-blue-600 text-white px-4 py-2 text-xs font-semibold tracking-wider">
          FLASH
        </div>

        {/* NEWS TICKER */}

        <div className="flex-1 overflow-hidden">

          <div className="animate-marquee whitespace-nowrap px-6 text-sm">

            {news.map((n) => (

              <Link
                key={n.id}
                href={`/${n.category?.slug}/${n.slug}`}
                className="mr-10 hover:text-blue-700 transition"
              >
                {n.title}
              </Link>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}