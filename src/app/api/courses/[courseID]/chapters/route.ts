import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: {
      courseID: string;
    };
  }
) {
  try {
    const userID = nextFetchUserID();
    const { title } = await request.json();

    const courseOwner = await database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },
    });

    if (!courseOwner) return new NextResponse("Unathorized", { status: 401 });

    const lastChapter = await database.chapter.findFirst({
      where: {
        courseID: params.courseID,
      },

      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await database.chapter.create({
      data: {
        title,
        courseID: params.courseID,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[POST CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
