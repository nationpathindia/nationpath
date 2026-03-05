import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {

  const body = await req.json();
  const id = body.id;

  if (!id) {
    return Response.json(
      { success:false },
      { status:400 }
    );
  }

  await prisma.newsletterSubscriber.delete({
    where:{ id }
  });

  return Response.json({
    success:true
  });

}