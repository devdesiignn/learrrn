import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

import { database } from "@/lib/database";
import { fetchUserID } from "@/lib/fetchUserID";
import IconBadge from "@/components/IconBadge";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";
import Banner from "@/components/Banner";
import Actions from "./_components/Actions";

export default async function CoursePage({ params }: { params: { courseID: string } }) {
  const userID = fetchUserID();

  const course = await database.course.findUnique({
    where: {
      id: params.courseID,
      userID,
    },

    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },

      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const categories = await database.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageURL,
    course.price,
    course.categoryID,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && <Banner label="This course is unpublished. It will not be visible to the students." />}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>

            <span className="text-base text-slate-700">Complete all fields {completionText}</span>
          </div>

          {/* ADD ACTIONS */}
          <Actions disabled={!isComplete} courseID={params.courseID} isPublished={course.isPublished} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course} courseID={course.id} />

            <DescriptionForm initialData={course} courseID={course.id} />

            <ImageForm initialData={course} courseID={course.id} />

            <CategoryForm
              initialData={course}
              courseID={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>

              <ChaptersForm initialData={course} courseID={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>

              <PriceForm initialData={course} courseID={course.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>

              <AttachmentForm initialData={course} courseID={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
