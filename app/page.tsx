import { prisma } from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function Home() {

  let articles: any[] = [];

  try {

    articles = await prisma.article.findMany({
      take: 10,
      orderBy: { createdAt: "desc" }
    });

  } catch (err) {
    console.error("DB error:", err);
  }

  return (
    <main style={{padding:"60px",maxWidth:"900px",margin:"auto"}}>

      <h1>Nation Path</h1>

      {articles.length === 0 && (
        <p>No articles found.</p>
      )}

      {articles.map((a) => (
        <div key={a.id} style={{marginBottom:"30px"}}>
          <h2>{a.title}</h2>
        </div>
      ))}

    </main>
  );
}