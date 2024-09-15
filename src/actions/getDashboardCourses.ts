import { database } from "@/lib/database";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type Course_Progress_Category = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: Course_Progress_Category[];
  coursesInProgress: Course_Progress_Category[];
};

export async function getDashboardCourses(userID: string): Promise<DashboardCourses> {
  try {
    const purchasedCourses = await database.purchase.findMany({
      where: {
        userID,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchasedCourse) => purchasedCourse.course) as Course_Progress_Category[];

    for (let course of courses) {
      const progress = await getProgress(userID, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter((course) => course.progress === 100);

    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) !== 100);

    return { completedCourses, coursesInProgress };
  } catch (error) {
    console.log("[GET DASHBOARD COURSE]", error);

    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
}
