import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { database } from "@/lib/database";
import { fetchUserID } from "@/lib/fetchUserID";
import IconBadge from "@/components/IconBadge";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import Banner from "@/components/Banner";
import ChapterActions from "./_components/ChapterActions";

export default async function ChapterPage({
  params,
}: {
  params: {
    courseID: string;
    chapterID: string;
  };
}) {
  const userID = fetchUserID();

  const chapter = await database.chapter.findUnique({
    where: {
      id: params.chapterID,
      courseID: params.courseID,
    },

    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoURL];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && <Banner variant="warning" label="This chapter is unpublished. It will not be visible in the course." />}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link href={`/teacher/courses/${params.courseID}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>

                <span>Complete all fields {completionText}</span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseID={params.courseID}
                chapterID={params.chapterID}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>

              <ChapterTitleForm initialData={chapter} courseID={params.courseID} chapterID={params.chapterID} />

              <ChapterDescriptionForm initialData={chapter} courseID={params.courseID} chapterID={params.chapterID} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>

              <ChapterAccessForm initialData={chapter} courseID={params.courseID} chapterID={params.chapterID} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <ChapterVideoForm courseID={params.courseID} ChapterID={params.chapterID} initialData={chapter} />
          </div>
        </div>
      </div>
    </>
  );
}
