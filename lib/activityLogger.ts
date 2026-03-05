import { prisma } from "@/lib/prisma"

export async function logActivity({
userId,
action,
entity,
entityId
}:{
userId?:string
action:string
entity?:string
entityId?:string
}){

try{

await prisma.activityLog.create({
data:{
userId,
action,
entity,
entityId
}
})

}catch(err){

console.error("Activity log failed",err)

}

}