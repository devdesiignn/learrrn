import { NextResponse } from "next/server";

import nextFetchUserID from "@/lib/nextFetchUserID";
import { database } from "@/lib/database";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { courseID: string };
  }
) {
  try {
    const userID = nextFetchUserID();

    const course = await database.course.findUnique({
      where: { id: params.courseID, userID },

      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("Not Found", { status: 404 });

    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

    if (!course?.title || !course?.description || !course?.imageURL || !course.categoryID || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await database.course.update({
      where: {
        id: params.courseID,
        userID,
      },

      data: {
        IsPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("COURSE PUBLISH", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
