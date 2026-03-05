"use client";

import { useState } from "react";

export default function NewsletterForm() {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    if(!email) return;

    setLoading(true);

    const res = await fetch("/api/newsletter",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ email })
    });

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if(data.success){
      setEmail("");
    }

  };

  return (

<form onSubmit={handleSubmit} className="flex gap-2 mb-6">

<input
type="email"
required
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Enter your email"
className="flex-1 px-3 py-2 text-sm rounded-md bg-[#0a1224] border border-gray-600"
/>

<button
type="submit"
className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm rounded-md transition"
>

{loading ? "Joining..." : "Join"}

</button>

</form>

  );
}