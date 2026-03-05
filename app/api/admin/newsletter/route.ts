import { prisma } from "@/lib/prisma";

export async function GET(){

const subs = await prisma.newsletterSubscriber.findMany({
orderBy:{ createdAt:"desc" }
});

return Response.json(subs);

}