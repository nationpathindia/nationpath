"use client";

import { useState } from "react";

export default function LikeButton({ articleId, initialLikes }: {
  articleId: string;
  initialLikes: number;
}) {

  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  async function handleLike() {
    if (loading || clicked) return;

    setLoading(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId }),
      });

      const data = await res.json();

      if (data.likes !== undefined) {
        setLikes(data.likes);
        setClicked(true);
      }

    } catch (err) {
      console.error("Like error", err);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
        ${clicked ? "bg-blue-900 text-white" : "hover:bg-gray-100"}
      `}
    >
      👍
      <span className="text-sm font-medium">
        {likes}
      </span>
    </button>
  );
}