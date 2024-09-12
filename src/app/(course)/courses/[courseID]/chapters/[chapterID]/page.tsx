import { redirect } from "next/navigation";

import { getChapter } from "@/actions/getChapter";
import Banner from "@/components/Banner";
import { fetchUserID } from "@/lib/fetchUserID";
import VideoPlayer from "./_components/VideoPlayer";

export default async function ChapterIDPage({
  params,
}: {
  params: {
    courseID: string;
    chapterID: string;
  };
}) {
  const userID = fetchUserID();

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({
    userID,
    chapterID: params.chapterID,
    courseID: params.courseID,
  });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && <Banner variant="success" label="You already completed this chapter." />}

      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter." />}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterID={params.chapterID}
            title={chapter.title}
            courseID={params.courseID}
            nextChapterID={nextChapter?.id}
            playbackID={muxData?.playback!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  );
}
