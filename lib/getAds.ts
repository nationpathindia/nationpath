import { prisma } from "@/lib/prisma";

export async function getAdByPlacement(placement: string) {
  try {
    const today = new Date();

    const ads = await prisma.ad.findMany({
      where: {
        placement: placement as any,
        status: "active",
        completed: false,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    if (!ads.length) return null;

    // Remove ads exceeding maxClicks
    const validAds = ads.filter((ad) => {
      if (ad.maxClicks && ad.clicks >= ad.maxClicks) return false;
      return true;
    });

    if (!validAds.length) {
      await prisma.ad.updateMany({
        where: {
          id: { in: ads.map((a) => a.id) },
        },
        data: { completed: true },
      });

      return null;
    }

    // Random rotation among valid ads
    const randomIndex = Math.floor(Math.random() * validAds.length);
    return validAds[randomIndex];

  } catch (error) {
    console.error("Ad fetch error:", error);
    return null;
  }
}