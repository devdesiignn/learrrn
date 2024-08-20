"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { File, PlusCircle, Loader2, X } from "lucide-react";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };

  courseID: string;
}

const formSchema = z.object({
  fileURL: z.string().min(1, { message: "Attachment is required." }),
});

export default function AttachmentForm({ initialData, courseID }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingID, setDeletingID] = useState<string | null>(null);

  function toggleEdit() {
    setIsEditing((editingState) => !editingState);
  }

  const router = useRouter();

  async function _onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseID}/attachments`, formValues);

      toast.success("Course Updated!");
      toggleEdit();

      router.refresh();
    } catch (error) {
      console.log("[ATTACHMENT FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  async function _onDelete(attachmentID: string) {
    try {
      setDeletingID(attachmentID);
      await axios.delete(`/api/courses/${courseID}/attachments/${attachmentID}`);

      toast.success("Attachment Deleted!");

      router.refresh();
    } catch (error) {
      console.log("[ATTACHMENT FORM DELETE]", error);
      toast.error("Something went wrong!");
    } finally {
      setDeletingID(null);
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(fileURL) => {
              if (fileURL) {
                _onSubmit({ fileURL });
              }
            }}
          />

          <div className="text-sm text-muted-foreground mt-4">
            Add any resources your students might need to complete the course
          </div>
        </div>
      ) : initialData.attachments.length > 0 ? (
        <div className="space-y-2">
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="
            flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
              <File className="w-4 h-4 mr-2 flex-shrink-0" />
              <p className="text-sm line-clamp-1">{attachment.name}</p>

              {deletingID === attachment.id ? (
                <div className="ml-auto">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <button className="ml-auto hover:opacity-75 transition" onClick={() => _onDelete(attachment.id)}>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-base mt-2 text-slate-500 italic">No attachments yet</p>
      )}
    </div>
  );
}
