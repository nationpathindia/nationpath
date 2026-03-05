import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest){

const role = req.cookies.get("role")?.value

const path = req.nextUrl.pathname

/* ADMIN ONLY */

if(path.startsWith("/admin/users")){
if(role !== "admin"){
return NextResponse.redirect(new URL("/",req.url))
}
}

/* EDITOR ACCESS */

if(path.startsWith("/admin/editorial")){
if(role !== "admin" && role !== "editor"){
return NextResponse.redirect(new URL("/",req.url))
}
}

/* REPORTER */

if(path.startsWith("/admin/reporter")){
if(role !== "admin" && role !== "editor" && role !== "reporter"){
return NextResponse.redirect(new URL("/",req.url))
}
}

/* ADVERTISER */

if(path.startsWith("/admin/ads")){
if(role !== "admin" && role !== "advertiser"){
return NextResponse.redirect(new URL("/",req.url))
}
}

return NextResponse.next()

}

export const config = {

matcher:[
"/admin/:path*"
]

}