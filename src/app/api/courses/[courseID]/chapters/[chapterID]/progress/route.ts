import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";
import { NextResponse } from "next/server";

export async function PUT(
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

    const { isCompleted } = await request.json();

    const userProgress = await database.userProgress.upsert({
      where: {
        userID_chapterID: {
          userID,
          chapterID: params.chapterID,
        },
      },

      update: {
        isCompleted,
      },

      create: {
        userID,
        chapterID: params.chapterID,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[PUT_CHAPTER_PROGRESS", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
