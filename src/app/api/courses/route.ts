import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";
import { isTeacher } from "@/lib/teacher";

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const userID = nextFetchUserID();

    if (!isTeacher(userID)) return new NextResponse("Unauthorized", { status: 401 });

    const course = await database.course.create({
      data: { userID, title },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[POST COURSES]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
