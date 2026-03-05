import { cookies } from "next/headers";
import User from "@/app/models/User";
import { verifyToken } from "./auth";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const decoded: any = verifyToken(token);
  if (!decoded) return null;

  await dbConnect();

  const user = await User.findById(decoded.id).lean();
  if (!user) return null;

  if (user.status === "blocked") return null;

  return user;
}