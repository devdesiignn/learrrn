import { NextResponse } from "next/server";

import nextFetchUserID from "@/lib/nextFetchUserID";
import { database } from "@/lib/database";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { courseID: string; chapterID: string };
  }
) {
  try {
    const userID = nextFetchUserID();

    const ownCourse = await database.course.findUnique({
      where: { id: params.courseID, userID },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const unpublishedChapter = await database.chapter.update({
      where: {
        id: params.chapterID,
        courseID: params.courseID,
      },

      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await database.chapter.findMany({
      where: {
        courseID: params.courseID,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await database.course.update({
        where: {
          id: params.courseID,
        },

        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("CHAPTER UNPUBLISH", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
