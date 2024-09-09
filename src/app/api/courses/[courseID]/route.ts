import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

export async function DELETE(
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
    // const { courseID } = params;

    const course = await database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },

      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) return new NextResponse("Not Found", { status: 404 });

    // CLEANUP ALL MUXDATA
    for (const chapter of course.chapters) {
      if (chapter.muxData) {
        await video.assets.delete(chapter.muxData.assetID);
      }
    }

    const deletedCourse = await database.course.delete({
      where: {
        id: params.courseID,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[DELETE COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
