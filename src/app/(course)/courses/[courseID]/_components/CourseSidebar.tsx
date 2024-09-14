import { Chapter, Course, UserProgress } from "@prisma/client";

import { fetchUserID } from "@/lib/fetchUserID";
import { database } from "@/lib/database";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/CourseProgress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export default async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const userID = fetchUserID();

  const purchase = await database.purchase.findUnique({
    where: {
      userID_courseID: {
        userID,
        courseID: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="px-8 py-4 flex flex-col border-b">
        <h1 className="font-semibold mb-4">{course.title}</h1>

        {purchase && (
          <div>
            <CourseProgress variant={progressCount === 100 ? "success" : "default"} value={progressCount} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseID={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
}
