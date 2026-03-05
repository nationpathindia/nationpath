import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);
    const placement = searchParams.get("placement");

    if (!placement) {
      return NextResponse.json(
        { success: false, message: "Placement required" },
        { status: 400 }
      );
    }

    const now = new Date();

    /* ==============================
       1️⃣ Fetch Ads
    ============================== */

    const ads = await prisma.ad.findMany({
      where: {
        placement: placement as any,
        status: "active",
        completed: false,

        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },

      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],

      select: {
        id: true,
        type: true,
        imageUrl: true,
        link: true,
        adsenseCode: true,
        clicks: true,
        cpc: true,
        totalBudget: true,
      },
    });

    if (!ads.length) {
      return NextResponse.json({ success: true, ad: null });
    }

    /* ==============================
       2️⃣ Budget Filter
    ============================== */

    const validAds = ads.filter((ad) => {

      if (!ad.totalBudget || !ad.cpc) return true;

      const spent = (ad.clicks ?? 0) * ad.cpc;

      return spent < ad.totalBudget;

    });

    if (!validAds.length) {
      return NextResponse.json({ success: true, ad: null });
    }

    /* ==============================
       3️⃣ Random Rotation
    ============================== */

    const selected =
      validAds[Math.floor(Math.random() * validAds.length)];

    /* ==============================
       4️⃣ Response
    ============================== */

    return NextResponse.json({
      success: true,
      ad: {
        id: selected.id,
        type: selected.type,
        imageUrl: selected.imageUrl,
        link: selected.link,
        adsenseCode: selected.adsenseCode,
      },
    });

  } catch (error) {

    console.error("Ad Serve Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }

}