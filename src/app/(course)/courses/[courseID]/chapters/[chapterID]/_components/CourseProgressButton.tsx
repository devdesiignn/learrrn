"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/useConfettiStore";
import axios from "axios";

import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterID: string;
  courseID: string;
  nextChapterID?: string;
  isCompleted?: boolean;
}

export default function CourseProgressButton({ chapterID, courseID, nextChapterID, isCompleted }: CourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const Icon = isCompleted ? XCircle : CheckCircle;

  const _onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/courses/${courseID}/chapters/${chapterID}/progress`, {
        isCompleted: !isCompleted,
      });

      if (!isCompleted && !nextChapterID) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterID) {
        router.push(`/courses/${courseID}/chapters/${nextChapterID}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      console.log("[COURSE PROGRESS BUTTON]", error);

      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
      onClick={_onClick}
      disabled={isLoading}>
      {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
