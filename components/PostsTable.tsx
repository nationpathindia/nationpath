"use client";

import { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  status: string;
  category: string; // ya type — jo aapke DB me hai
}

interface Props {
  type: string;
}

export default function PostsTable({ type }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: Post[]) => {
        // 👇 yahan filter laga do
        const filtered = data.filter(
          (post) => post.category === type // agar field "type" hai toh post.type === type
        );
        setPosts(filtered);
      });
  }, [type]);

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="border p-4 mb-2 rounded">
          <h2 className="font-semibold">{post.title}</h2>
          <p>Status: {post.status}</p>
        </div>
      ))}
    </div>
  );
}