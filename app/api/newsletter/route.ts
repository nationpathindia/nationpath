import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return Response.json(
        { success:false, message:"Email required" },
        { status:400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where:{ email }
    });

    if(existing){
      return Response.json({
        success:false,
        message:"Already subscribed"
      });
    }

    await prisma.newsletterSubscriber.create({
      data:{ email }
    });

    return Response.json({
      success:true,
      message:"Subscribed successfully"
    });

  } catch (error) {

    return Response.json(
      { success:false, message:"Server error" },
      { status:500 }
    );

  }

}