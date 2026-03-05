import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TrendingNews() {

  const trending = await prisma.article.findMany({
    where: {
      status: "approved",
      isDeleted: false,
      lastViewAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      trendingScore: "desc",
    },
    take: 5,
    include: {
      category: true,
    },
  });

  if (!trending.length) return null;

  return (
    <div>

      <h3 className="text-sm uppercase tracking-widest mb-6">
        Trending Now
      </h3>

      {trending.map((item, index) => (

        <Link
          key={item.id}
          href={`/${item.category?.slug}/${item.slug}`}
          className="flex gap-4 mb-6 hover:text-blue-900"
        >

          <span className="text-3xl text-gray-200 font-bold">
            {String(index + 1).padStart(2, "0")}
          </span>

          <p className="text-sm font-serif">
            {item.title}
          </p>

        </Link>

      ))}

    </div>
  );
}