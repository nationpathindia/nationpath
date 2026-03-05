import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {

  const baseUrl = "https://www.nationpathindia.com";

  return {

    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin",
          "/api",
          "/_next",
        ],
      },
    ],

    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],

    host: baseUrl,

  };

}