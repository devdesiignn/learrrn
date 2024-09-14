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

    const ownCourse = await database.course.findUnique({
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
        try {
          await video.assets.delete(existingMuxData.assetID);
        } catch (error) {
          console.log("[Mux Asset Delete]", error);
        }

        await database.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      try {
        const asset = await video.assets.create({
          input: values.videoURL,
          playback_policy: ["public"],
          test: false,
        });

        if (asset) {
          await database.muxData.create({
            data: {
              chapterID: params.chapterID,
              assetID: asset.id,
              playback: asset.playback_ids?.["0"].id,
            },
          });
        }
      } catch (error) {
        console.log("[Mux Asset Create]", error);
      }
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("UPDATE CHAPTER API", error);

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
      chapterID: string;
    };
  }
) {
  try {
    const userID = nextFetchUserID();

    const ownCourse = await database.course.findUnique({
      where: {
        id: params.courseID,
        userID,
      },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await database.chapter.findUnique({
      where: {
        id: params.chapterID,
        courseID: params.courseID,
      },
    });

    if (!chapter) return new NextResponse("Not Found", { status: 404 });

    // DELETE MUX DATA
    if (chapter.videoURL) {
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

    const deletedChapter = await database.chapter.delete({
      where: {
        id: params.chapterID,
      },
    });

    const publishedChaptersInCourse = await database.chapter.findMany({
      where: {
        courseID: params.courseID,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await database.course.update({
        where: {
          id: params.courseID,
        },

        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("DELETE CHAPTER API", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
