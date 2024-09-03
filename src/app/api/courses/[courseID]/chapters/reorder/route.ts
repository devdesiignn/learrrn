import { NextResponse } from "next/server";

import nextFetchUserID from "@/lib/nextFetchUserID";
import { database } from "@/lib/database";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { courseID: string };
  }
) {
  try {
    const userID = nextFetchUserID();

    const { list } = await request.json();

    const ownCourse = await database.course.findUnique({
      where: { id: params.courseID, userID },
    });

    if (!ownCourse) return new NextResponse("Unauthorised", { status: 401 });

    for (let item of list) {
      await database.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("REORDER CHAPTER API", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
