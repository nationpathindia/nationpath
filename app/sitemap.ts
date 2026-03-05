import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  try {

    const baseUrl = "https://www.nationpathindia.com";

    /* ================= ARTICLES ================= */

    const articles = await prisma.article.findMany({
      where: {
        status: "approved",
        isDeleted: false,
      },
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: {
            slug: true,
          },
        },
      },
    });

    const articleUrls = articles.map((article) => ({
      url: `${baseUrl}/${article.category?.slug}/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    /* ================= CATEGORIES ================= */

    const categories = await prisma.category.findMany({
      select: {
        slug: true,
      },
    });

    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    /* ================= STATIC PAGES ================= */

    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/advertise`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
    ];

    return [
      ...staticPages,
      ...categoryUrls,
      ...articleUrls,
    ];

  } catch (error) {

    console.error("SITEMAP ERROR:", error);

    return [];

  }

}