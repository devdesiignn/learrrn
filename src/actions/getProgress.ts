import { database } from "@/lib/database";

export async function getProgress(userID: string, courseID: string): Promise<number> {
  try {
    const publishedChapters = await database.chapter.findMany({
      where: {
        courseID,
        isPublished: true,
      },

      select: {
        id: true,
      },
    });

    const publishedChaptersIDs = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await database.userProgress.count({
      where: {
        userID,
        chapterID: {
          in: publishedChaptersIDs,
        },

        isCompleted: true,
      },
    });

    const progressPercentage = (validCompletedChapters / publishedChaptersIDs.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("GET PROGRESS", error);

    return 0;
  }
}
