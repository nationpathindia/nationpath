import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Invalid campaign", { status: 400 });
  }

  const ad = await prisma.ad.findUnique({
    where: { id }
  });

  if (!ad) {
    return new Response("Campaign not found", { status: 404 });
  }

  const views = ad.views ?? 0;
  const clicks = ad.clicks ?? 0;
  const ctr =
    views > 0 ? ((clicks / views) * 100).toFixed(2) : "0";

  const revenue = clicks * (ad.cpc ?? 0);

  const csv = `Campaign,Placement,Views,Clicks,CTR,Revenue
${ad.title},${ad.placement},${views},${clicks},${ctr}%,₹${revenue}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${ad.title}-report.csv"`
    }
  });
}