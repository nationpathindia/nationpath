"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function InfiniteArticles({ initialArticles }: any) {
  const [articles, setArticles] = useState(initialArticles || []);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    const res = await fetch(
      `/api/articles?page=${page}&limit=6&lightweight=true`
    );
    const data = await res.json();

    setArticles((prev: any) => [...prev, ...data.articles]);
    setHasMore(data.pagination.hasMore);
    setPage((prev) => prev + 1);

    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="space-y-8">
      {articles.map((item: any) => (
        <div
          key={item.id}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 hover:shadow-md transition"
        >
        <Link
  href={`/${item.isEditorial ? "editorial" : "article"}/${item.slug}`}
>
            <h2 className="text-2xl font-semibold hover:text-red-600 transition mb-2">
              {item.title}
            </h2>
          </Link>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {item.content.replace(/<[^>]+>/g, "").slice(0, 140)}...
          </p>
        </div>
      ))}

      {loading && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6" />
        </div>
      )}

      {hasMore && <div ref={observerRef} className="h-10" />}
    </div>
  );
}