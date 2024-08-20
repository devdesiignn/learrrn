import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";

export async function PATCH(
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
    const { courseID } = params;

    const values = await request.json();

    const course = await database.course.update({
      where: {
        id: courseID,
        userID,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[PATCH COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
