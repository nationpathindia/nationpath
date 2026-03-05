import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    if (user.status === "blocked")
      return NextResponse.json({ error: "Account blocked" }, { status: 403 });

    const token = signToken({
      id: user._id,
      role: user.role,
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}