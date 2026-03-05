import Link from "next/link";
import Image from "next/image";

export default function ArticleCard({ item }: any) {
  const stripHtml = (html: string) =>
    html?.replace(/<[^>]+>/g, "") || "";

  return (
    <div className="flex gap-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition p-5">

      {item.images?.[0] && (
        <div className="relative w-[140px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        {item.category && (
          <span className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-2">
            {item.category.name}
          </span>
        )}

       <Link
  href={`/${item.isEditorial ? "editorial" : "article"}/${item.slug}`}
>
          <h2 className="text-lg font-semibold hover:text-orange-500 transition dark:text-white">
            {item.title}
          </h2>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
          {stripHtml(item.content).slice(0, 120)}...
        </p>
      </div>
    </div>
  );
}