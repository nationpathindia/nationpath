import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {

  try {

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    /* ================= CLEAR TOKEN COOKIE ================= */

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0)
    });

    return response;

  } catch (error) {

    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Logout failed"
      },
      { status: 500 }
    );

  }

}