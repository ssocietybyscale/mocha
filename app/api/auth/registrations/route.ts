import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Registration from "@/app/models/Registration";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-auth")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verified = await verifyToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await Registration.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json(data);
}
