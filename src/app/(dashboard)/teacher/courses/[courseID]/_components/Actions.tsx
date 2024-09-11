"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface ActionsProps {
  disabled: boolean;
  courseID: string;
  isPublished: boolean;
}

export default function Actions({ disabled, courseID, isPublished }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const _onPublish = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseID}/unpublish`);
        toast.success("Course Unpublished");
      } else {
        await axios.patch(`/api/courses/${courseID}/publish`);
        toast.success("Course Published");

        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      console.log("PUBLISH / UNPUBLISH COURSE", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const _onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseID}`);

      toast.success("Course Deleted");
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      console.log("DELETE COURSE", error);
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
