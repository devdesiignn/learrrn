import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default function nextFetchUserID() {
  const { userId } = auth();

  if (!userId) throw new NextResponse("Unauthorized", { status: 401 });

  return userId;
}
