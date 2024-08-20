import { NextResponse } from "next/server";

import nextFetchUserID from "@/lib/nextFetchUserID";
import { database } from "@/lib/database";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      courseID: string;
      attachmentID: string;
    };
  }
) {
  try {
    const userID = nextFetchUserID();

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

    const attachment = await database.attachment.delete({
      where: {
        courseID: params.courseID,
        id: params.attachmentID,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[DELETE ATTACHMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
