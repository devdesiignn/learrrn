import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import { database } from "@/lib/database";
import nextFetchUserID from "@/lib/nextFetchUserID";

const { video } = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET });

export async function PATCH(
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
    const { isPublished, ...values } = await request.json();

    const ownCourse = database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await database.chapter.update({
      where: {
        id: params.chapterID,
        courseID: params.courseID,
      },

      data: {
        ...values,
      },
    });

    // CLEANUP FOR EXISTING MUXDATA VIDEO URL (IF EDITED)
    if (values.videoURL) {
      const existingMuxData = await database.muxData.findFirst({
        where: {
          chapterID: params.chapterID,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetID);
        await database.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const asset = await video.assets.create({
      input: values.videoURL,
      playback_policy: ["public"],
      test: false,
    });

    await database.muxData.create({
      data: {
        chapterID: params.chapterID,
        assetID: asset.id,
        playback: asset.playback_ids?.[0]?.id,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("UPDATE CHAPTER API", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
