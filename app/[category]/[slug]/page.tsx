import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import AdRenderer from "@/components/AdRenderer";

export const dynamic = "force-dynamic";
export const revalidate = 0;
interface Props {
  params: {
    category: string;
    slug: string;
  };
}

/* ================= METADATA ================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) return {};

  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      categoryId: category.id,
      status: "approved",
    },
  });

  if (!article) return {};

  const canonical = `https://www.nationpathindia.com/${params.category}/${params.slug}`;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || "",

    alternates: {
      canonical,
    },

    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || "",
      url: canonical,
      images: article.images?.[0] ? [article.images[0]] : [],
      type: "article",
      siteName: "Nation Path",
    },

    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || "",
      images: article.images?.[0] ? [article.images[0]] : [],
    },
  };
}

/* ================= PAGE ================= */

export default async function ArticlePage({ params }: Props) {

  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) return notFound();

  const article = await prisma.article.findFirst({
    where: {
      slug: params.slug,
      categoryId: category.id,
      status: "approved",
    },
    include: { category: true },
  });

  if (!article) return notFound();

  /* VIEW UPDATE */

  await prisma.article.update({
    where: { id: article.id },
    data: {
      views: { increment: 1 },
      lastViewAt: new Date(),
      trendingScore: { increment: 1 },
    },
  });

  /* MOST READ */

  const mostRead = await prisma.article.findMany({
    where: { status: "approved", isDeleted: false },
    orderBy: { views: "desc" },
    take: 5,
    include: { category: true },
  });

  /* TRENDING */

  const trending = await prisma.article.findMany({
    where: {
      status: "approved",
      isDeleted: false,
    },
    orderBy: {
      trendingScore: "desc",
    },
    take: 5,
    include: { category: true },
  });

  /* RELATED */

  let related = await prisma.article.findMany({
    where: {
      status: "approved",
      isDeleted: false,
      categoryId: category.id,
      NOT: { id: article.id },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  if (related.length < 4) {
    related = await prisma.article.findMany({
      where: {
        status: "approved",
        isDeleted: false,
        NOT: { id: article.id },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  /* NEXT ARTICLE */

  const nextArticle = await prisma.article.findFirst({
    where: {
      status: "approved",
      isDeleted: false,
      id: { not: article.id },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  function cleanText(html: string) {
    return html
      ?.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const wordCount = cleanText(article.content).split(" ").length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const paragraphs = article.content.split("</p>");

  const articleUrl = `https://www.nationpathindia.com/${category.slug}/${article.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">

      {/* ================= SCHEMA ================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "@id": articleUrl,
            headline: article.title,
            description: article.metaDescription || article.excerpt || "",
            image: article.images?.[0]
              ? [{ "@type": "ImageObject", url: article.images[0] }]
              : [],
            thumbnailUrl: article.images?.[0] || "",
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            inLanguage: "en-IN",
            articleSection: category.name,
            wordCount: wordCount,
            timeRequired: `PT${readingTime}M`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": articleUrl,
            },
            author: {
              "@type": "Organization",
              name: "Nation Path",
            },
            publisher: {
              "@type": "Organization",
              name: "Nation Path",
              logo: {
                "@type": "ImageObject",
                url: "https://www.nationpathindia.com/logo.png",
                width: 600,
                height: 60,
              },
            },
          }),
        }}
      />

      <div className="grid lg:grid-cols-3 gap-16">

        {/* MAIN ARTICLE */}

        <div className="lg:col-span-2">

          <div className="text-sm text-gray-500 mb-6">
            <Link href="/">Home</Link> {" > "}
            <Link href={`/category/${category.slug}`}>
              {category.name}
            </Link>{" "}
            {" > "}
            {article.title}
          </div>

          <div className="flex justify-center my-8">
            <AdRenderer placement="article_top" />
          </div>

          <span className="bg-blue-900 text-white text-xs px-3 py-1 rounded uppercase">
            {category.name}
          </span>

          <h1 className="font-serif text-4xl md:text-5xl leading-tight mt-6 mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            <span>{readingTime} min read</span>
            <span>{article.views + 1} views</span>
          </div>

          <div className="mb-10">
            <LikeButton
              articleId={article.id}
              initialLikes={article.likes}
            />
          </div>

          {article.images?.[0] && (
            <div className="relative w-full h-[450px] mb-12 rounded-2xl overflow-hidden">
              <Image
                src={article.images[0]}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none leading-relaxed">

          {paragraphs.map((para: string, index: number) => (
              <div key={index}>

                <div
                  dangerouslySetInnerHTML={{
                    __html: para + "</p>",
                  }}
                />

                {(index === 2 || index === 5 || index === 8) && (
                  <div className="my-10 flex justify-center">
                    <AdRenderer placement="article_mid" />
                  </div>
                )}

              </div>
            ))}

          </div>

          <div className="flex justify-center my-14">
            <AdRenderer placement="article_bottom" />
          </div>

        </div>

        {/* SIDEBAR */}

        <aside className="space-y-10 lg:sticky lg:top-24 self-start">

          {/* MOST READ */}

          <div>

            <h3 className="text-sm uppercase tracking-widest mb-6">
              Most Read
            </h3>

            {mostRead.map((item: any, index: number) => (
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

          {/* TRENDING */}

          <div>

            <h3 className="text-sm uppercase tracking-widest mb-6">
              Trending
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

          <div className="flex justify-center">
            <AdRenderer placement="article_sidebar" />
          </div>

        </aside>

      </div>

    </div>
  );
}