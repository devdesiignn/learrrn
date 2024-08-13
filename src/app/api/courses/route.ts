import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { database } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const { userId: userID } = auth();
    const { title } = await request.json();

    if (!userID) return new NextResponse("Unauthorized", { status: 401 });

    const course = await database.course.create({
      data: { userID, title },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[POST COURSES]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
