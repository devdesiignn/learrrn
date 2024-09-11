import { redirect } from "next/navigation";

import { fetchUserID } from "@/lib/fetchUserID";
import { database } from "@/lib/database";
import { getProgress } from "@/actions/getProgress";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    courseID: string;
  };
}) {
  const userID = fetchUserID();

  const course = await database.course.findUnique({
    where: {
      id: params.courseID,
    },

    include: {
      chapters: {
        where: {
          isPublished: true,
        },

        include: {
          userProgress: {
            where: {
              userID,
            },
          },
        },

        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  const progressCount = await getProgress(userID, course.id);

  return (
    <div className="h-full">
      <div className="h-[90px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>

      <main className="md:pl-80 h-full pt-[90px]">{children}</main>
    </div>
  );
}
