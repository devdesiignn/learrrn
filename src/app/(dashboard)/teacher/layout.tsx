import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId: userID } = auth();

  if (!isTeacher(userID)) {
    return redirect("/");
  }

  return <>{children}</>;
}
 