"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/ConfirmModal";

interface ChapterActionsProps {
  disabled: boolean;
  courseID: string;
  chapterID: string;
  isPublished: boolean;
}

export default function ChapterActions({ disabled, courseID, chapterID, isPublished }: ChapterActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const _onPublish = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseID}/chapters/${chapterID}/unpublish`);
        toast.success("Chapter Unpublished");
      } else {
        await axios.patch(`/api/courses/${courseID}/chapters/${chapterID}/publish`);
        toast.success("Chapter Published");
      }

      router.refresh();
    } catch (error) {
      console.log("PUBLISH / UNPUBLISH CHAPTER", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const _onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseID}/chapters/${chapterID}`);

      toast.success("Chapter Deleted");
      router.refresh();
      router.push(`/teacher/courses/${courseID}`);
    } catch (error) {
      console.log("DELETE CHAPTER", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={_onPublish} disabled={disabled || isLoading} variant="outline" size="sm">
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={_onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
