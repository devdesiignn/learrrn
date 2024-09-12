import { redirect } from "next/navigation";

import { database } from "@/lib/database";

export default async function CourseIDPage({
  params,
}: {
  params: {
    courseID: string;
  };
}) {
  const course = await database.course.findUnique({
    where: {
      id: params.courseID,
    },

    include: {
      chapters: {
        where: {
          isPublished: true,
        },

        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
