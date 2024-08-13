import { NextResponse } from "next/server";

import { database } from "@/lib/database";
import nextFetchUserID from "@/utils/nextFetchUserID";

export async function POST(request: Request) {
  try {
    const { title } = await request.json();

    const userID = nextFetchUserID();

    const course = await database.course.create({
      data: { userID, title },
    });
    
    return NextResponse.json(course);
  } catch (error) {
    console.log("[POST COURSES]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
