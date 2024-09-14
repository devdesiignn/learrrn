"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface VideoPlayerProps {
  chapterID: string;
  title: string;
  courseID: string;
  nextChapterID?: string;
  playbackID: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export default function VideoPlayer({ chapterID, title, courseID, nextChapterID, playbackID, isLocked, completeOnEnd }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const _onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseID}/chapters/${chapterID}/progress`, { isCompleted: true });
      }

      if (!nextChapterID) {
        confetti.onOpen();
      }

      toast.success("Progress Updated");
      router.refresh();

      if (nextChapterID) {
        router.push(`/courses/${courseID}/chapters/${nextChapterID}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />

          <p className="text-sm">This chapter is locked.</p>
        </div>
      ) : (
        <>
          <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => setIsReady(true)}
            onEnded={_onEnd}
            autoPlay
            playbackId={playbackID}
          />

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
