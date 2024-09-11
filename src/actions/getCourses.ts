import { Category, Course } from "@prisma/client";

import { database } from "@/lib/database";
import { getProgress } from "@/actions/getProgress";

type Course_Progress_Category = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userID: string;
  title?: string;
  categoryID?: string;
};

export async function getCourses({ userID, title, categoryID }: GetCourses): Promise<Course_Progress_Category[]> {
  try {
    const courses = await database.course.findMany({
      where: {
        isPublished: true,

        title: {
          contains: title,
        },

        categoryID,
      },

      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },

          select: {
            id: true,
          },
        },

        purchases: {
          where: {
            userID,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: Course_Progress_Category[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userID, course.id);

        return { ...course, progress: progressPercentage };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("GET COURSES", error);

    return [];
  }
}
