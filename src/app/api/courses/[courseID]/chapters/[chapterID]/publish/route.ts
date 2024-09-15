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

    const chapter = await database.chapter.findUnique({
      where: { id: params.chapterID, courseID: params.courseID },
    });

    const muxData = await database.muxData.findUnique({
      where: {
        chapterID: params.chapterID,
      },
    });

    if (!chapter || !muxData || !chapter?.title || !chapter?.description || !chapter?.videoURL) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await database.chapter.update({
      where: {
        id: params.chapterID,
        courseID: params.courseID,
      },

      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("CHAPTER PUBLISH", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
