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
    });

    if (!course) return new NextResponse("Not Found", { status: 404 });

    const unpublishedCourse = await database.course.update({
      where: {
        id: params.courseID,
        userID,
      },

      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("COURSE UNPUBLISH", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
