"use client"

import { useEffect, useState } from "react"

export default function VisitorMessages(){

const [messages,setMessages] = useState<any[]>([])

useEffect(()=>{

fetch("/api/admin/chat/visitors")
.then(res=>res.json())
.then(data=>setMessages(data))

},[])

return(

<div className="bg-[#0e1726] border border-gray-800 rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4 text-white">
Visitor Messages
</h2>

<div className="space-y-4">

{messages.length === 0 &&(
<p className="text-gray-400 text-sm">
No visitor messages yet
</p>
)}

{messages.map(msg=>(
<div
key={msg.id}
className="border-b border-gray-800 pb-3"
>

<p className="text-sm text-gray-300">
<strong>{msg.name || "Visitor"}</strong>
</p>

<p className="text-xs text-gray-500">
{msg.email}
</p>

<p className="text-sm mt-1 text-gray-200">
{msg.message}
</p>

<p className="text-xs text-gray-500 mt-1">
{new Date(msg.createdAt).toLocaleString()}
</p>

</div>
))}

</div>

</div>

)

}