import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      courseID: string;
      chapterID: string;
    };
  }
) {
  try {
    const userID = nextFetchUserID();
    const { isPublished, ...values } = await request.json();

    const ownCourse = database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await database.chapter.update({
      where: {
        id: params.chapterID,
        courseID: params.courseID,
      },

      data: {
        ...values,
      },
    });

    // TODO: Handle Video URL

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("UPDATE CHAPTER API", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
