import { NextResponse } from "next/server";

import nextFetchUserID from "@/lib/nextFetchUserID";
import { database } from "@/lib/database";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { courseID: string };
  }
) {
  try {
    const userID = nextFetchUserID();
    const { fileURL } = await request.json();

    const courseOwner = await database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unathorized", {
        status: 401,
      });
    }

    const attachment = await database.attachment.create({
      data: {
        url: fileURL,
        name: fileURL.split("/").pop(),
        courseID: params.courseID,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[POST ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
