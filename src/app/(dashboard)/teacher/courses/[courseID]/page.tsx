import { database } from "@/lib/database";
import { fetchUserID } from "@/utils/fetchUserID";
import IconBadge from "@/components/IconBadge";

import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CoursePage({ params }: { params: { courseID: string } }) {
  const userID = fetchUserID();

  const course = await database.course.findUnique({
    where: {
      id: params.courseID,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [course.title, course.description, course.imageURL, course.price, course.categoryID];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>

          <span className="text-base text-slate-700">Complete all fields {completionText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard}  />
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
