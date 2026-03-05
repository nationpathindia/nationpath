"use client";

import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  images?: string[];
  category?: {
    name: string;
  };
}

interface Props {
  initialArticles: Article[];
}

export default function HomeFeed({ initialArticles }: Props) {
  const articles = initialArticles || [];

  const stripHtml = (html: string) =>
    html?.replace(/<[^>]+>/g, "") || "";

  if (!articles.length) {
    return (
      <div className="text-center text-gray-500 py-20">
        No articles available.
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {articles.map((item, index) => (
        <div key={item.id}>

          {/* ARTICLE */}
          <article className="group border-b border-gray-200 dark:border-gray-800 pb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {item.images?.[0] ? (
                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-full h-[320px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              <div className="flex flex-col justify-center">
                {item.category?.name && (
                  <span className="text-xs tracking-[3px] font-semibold text-blue-600 uppercase">
                    {item.category.name}
                  </span>
                )}

               <Link
  href={`/${(item as any).isEditorial ? "editorial" : "article"}/${item.slug}`}
>
                  <h2 className="text-3xl lg:text-4xl font-bold mt-4 leading-snug group-hover:text-blue-700 transition">
                    {item.title}
                  </h2>
                </Link>

                <p className="text-gray-600 dark:text-gray-400 mt-6 leading-relaxed text-lg">
                  {stripHtml(item.content).slice(0, 220)}...
                </p>

                <Link
                  href={`/article/${item.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
                >
                  Read Full Story →
                </Link>
              </div>
            </div>
          </article>

          {/* ================= MID FEED BOX AD ================= */}
          {index === 1 && (
            <div className="flex justify-center my-14">
              <div className="w-[300px] h-[250px] bg-gray-100 dark:bg-neutral-900 border dark:border-neutral-700 rounded flex items-center justify-center text-xs tracking-[0.4em] text-gray-400">
                ADVERTISEMENT
              </div>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}