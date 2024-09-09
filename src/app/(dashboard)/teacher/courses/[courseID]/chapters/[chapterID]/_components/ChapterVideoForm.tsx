"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

interface ChapterVideoProps {
  initialData: Chapter & { muxData?: MuxData | null };

  courseID: string;
  ChapterID: string;
}

const formSchema = z.object({
  videoURL: z.string().min(1, { message: "Video is required." }),
});

export default function ChapterVideo({ initialData, courseID, ChapterID }: ChapterVideoProps) {
  const [isEditing, setIsEditing] = useState(false);

  function toggleEdit() {
    setIsEditing((editingState) => !editingState);
  }

  const router = useRouter();

  async function _onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/courses/${courseID}/chapters/${ChapterID}`, formValues);

      toast.success("Chapter Updated!");
      toggleEdit();

      router.refresh();
    } catch (error) {
      console.log("[VIDEO FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : initialData.videoURL ? (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Video
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a Video
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(videoURL) => {
              if (videoURL) {
                _onSubmit({ videoURL });
              }
            }}
          />

          <div className="text-sm text-muted-foreground mt-4">Upload this chapter&apos;s video</div>
        </div>
      ) : initialData.videoURL ? (
        <>
          <div className="relative aspect-video mt-4">
            <MuxPlayer playbackId={initialData?.muxData?.playback || ""} />
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Videos can take a few minutes to process. Refresh the page if video does not appear.
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
          <VideoIcon className="h-8 w-8 text-slate-500" />
        </div>
      )}
    </div>
  );
}
