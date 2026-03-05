"use client"

import { useState } from "react"

export default function CreateUser(){

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [role,setRole] = useState("reporter")

async function createUser(){

await fetch("/api/admin/users/create",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
password,
role
})

})

alert("User created")

}

return(

<div className="bg-[#0e1726] p-6 rounded-xl border border-gray-800">

<h2 className="text-lg font-semibold mb-4">
Create User
</h2>

<input
placeholder="Name"
className="border p-2 w-full mb-2"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
className="border p-2 w-full mb-2"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
placeholder="Password"
type="password"
className="border p-2 w-full mb-2"
onChange={(e)=>setPassword(e.target.value)}
/>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setRole(e.target.value)}
>

<option value="editor">Editor</option>
<option value="reporter">Reporter</option>
<option value="advertiser">Advertiser</option>

</select>

<button
onClick={createUser}
className="bg-orange-500 px-4 py-2 rounded"
>

Create User

</button>

</div>

)

}