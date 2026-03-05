"use client"

import { useState } from "react"

export default function ChatWidget(){

const [open,setOpen] = useState(false)
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [message,setMessage] = useState("")

async function send(){

await fetch("/api/chat/send",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
message
})

})

setMessage("")
setOpen(false)

alert("Message sent")

}

return(

<div className="fixed bottom-6 right-6 z-50">

{open &&(

<div className="bg-white shadow-xl rounded-xl w-80 p-4 mb-3">

<h3 className="font-semibold mb-3">
Chat With Us
</h3>

<input
placeholder="Name"
className="border w-full p-2 mb-2"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
className="border w-full p-2 mb-2"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<textarea
placeholder="Message"
className="border w-full p-2 mb-2"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button
onClick={send}
className="bg-blue-600 text-white px-4 py-2 rounded w-full"
>
Send
</button>

</div>

)}

<button
onClick={()=>setOpen(!open)}
className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
>

💬

</button>

</div>

)

}