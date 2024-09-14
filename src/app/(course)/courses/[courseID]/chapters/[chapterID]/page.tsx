import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/getChapter";
import Banner from "@/components/Banner";
import { fetchUserID } from "@/lib/fetchUserID";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import RichTextPreview from "@/components/RichTextPreview";
import { Separator } from "@/components/ui/separator";
import CourseProgressButton from "./_components/CourseProgressButton";

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

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>

            {purchase ? (
              <CourseProgressButton 
              chapterID={params.chapterID} 
              courseID={params.courseID} 
              nextChapterID={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted} />
            ) : (
              <CourseEnrollButton courseID={params.courseID} price={course.price!} />
            )}
          </div>

          <Separator />

          <div>
            <RichTextPreview value={chapter.description!} />
          </div>

          {!!attachments.length && (
            <>
              <Separator />

              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline">
                    <File className="h-4 w-4 mr-2" />
                    <span className="line-clamp-1 block">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
