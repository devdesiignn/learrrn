import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function fetchUserID() {
  const { userId } = auth();
  if (!userId) return redirect("/login");

  return userId;
}
