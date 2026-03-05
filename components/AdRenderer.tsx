"use client";

import { useEffect, useRef, useState } from "react";

interface AdType {
  id: string;
  type: "image" | "adsense" | "script";
  imageUrl?: string;
  link?: string;
  adsenseCode?: string;
}

export default function AdRenderer({ placement }: { placement: string }) {

  const [ad, setAd] = useState<AdType | null>(null);
  const [visible, setVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const impressionSent = useRef<string | null>(null);

  /* ==============================
     1️⃣ Lazy Load Observer
  ============================== */

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();

  }, []);

  /* ==============================
     2️⃣ Fetch Ad
  ============================== */

  useEffect(() => {

    if (!placement || !visible) return;

    const controller = new AbortController();

    const fetchAd = async () => {

      try {

        const res = await fetch(
          `/api/ads/serve?placement=${placement}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await res.json();

        if (data?.success && data?.ad?.id) {
          setAd(data.ad);
        }

      } catch (error: any) {

        if (error.name !== "AbortError") {
          console.error("Ad fetch error:", error);
        }

      }

    };

    fetchAd();

    return () => controller.abort();

  }, [placement, visible]);

  /* ==============================
     3️⃣ Impression Tracking
  ============================== */

  useEffect(() => {

    if (!ad?.id) return;

    if (impressionSent.current === ad.id) return;

    const sendImpression = async () => {

      try {

        await fetch("/api/ads/impression", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adId: ad.id }),
        });

        impressionSent.current = ad.id;

      } catch (err) {
        console.error("Impression error:", err);
      }

    };

    sendImpression();

  }, [ad]);

  /* ==============================
     4️⃣ Click Tracking
  ============================== */

  const handleClick = async () => {

    if (!ad?.id) return;

    try {

      await fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id }),
      });

      if (ad.link) {
        window.open(ad.link, "_blank");
      }

    } catch (err) {
      console.error("Click tracking error:", err);
    }

  };

  /* ==============================
     5️⃣ Adsense Initialization
  ============================== */

  useEffect(() => {

    if (ad?.type !== "adsense") return;

    try {

      if (typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }

    } catch (err) {
      console.error("Adsense error:", err);
    }

  }, [ad]);

  /* ==============================
     6️⃣ No Ad
  ============================== */

  if (!ad) {
    return <div ref={containerRef} className="min-h-[90px]" />;
  }

  /* ==============================
     7️⃣ Image Ad
  ============================== */

  if (ad.type === "image" && ad.imageUrl) {
    return (
      <div ref={containerRef} className="my-6 flex justify-center min-h-[90px]">
        <img
          src={ad.imageUrl}
          alt="Advertisement"
          loading="lazy"
          onClick={handleClick}
          className="max-w-full h-auto cursor-pointer rounded-lg transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>
    );
  }

  /* ==============================
     8️⃣ Adsense Ad
  ============================== */

  if (ad.type === "adsense" && ad.adsenseCode) {
    return (
      <div
        ref={containerRef}
        className="my-6 flex justify-center min-h-[90px] overflow-hidden"
        dangerouslySetInnerHTML={{ __html: ad.adsenseCode }}
      />
    );
  }

  /* ==============================
     9️⃣ Script / HTML Ad
  ============================== */

  if (ad.type === "script" && ad.adsenseCode) {
    return (
      <div
        ref={containerRef}
        className="my-6 flex justify-center min-h-[90px]"
        dangerouslySetInnerHTML={{ __html: ad.adsenseCode }}
      />
    );
  }

  return null;

}