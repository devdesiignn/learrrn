import { database } from "@/lib/database";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userID: string;
  courseID: string;
  chapterID: string;
}

export async function getChapter({ userID, courseID, chapterID }: GetChapterProps) {
  try {
    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    const purchase = await database.purchase.findUnique({
      where: {
        userID_courseID: {
          userID,
          courseID,
        },
      },
    });

    const course = await database.course.findUnique({
      where: {
        isPublished: true,
        id: courseID,
      },
      select: {
        price: true,
      },
    });

    const chapter = await database.chapter.findUnique({
      where: {
        isPublished: true,
        id: chapterID,
      },
    });

    if (!course || !chapter) throw new Error("Course or Chapter not found");

    if (purchase) {
      attachments = await database.attachment.findMany({
        where: {
          courseID,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await database.muxData.findUnique({
        where: {
          chapterID,
        },
      });

      nextChapter = await database.chapter.findFirst({
        where: {
          courseID,
          isPublished: true,

          position: {
            gt: chapter?.position,
          },
        },

        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await database.userProgress.findUnique({
      where: {
        userID_chapterID: {
          userID,
          chapterID,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("GET CHAPTER ACTION", error);

    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
}
