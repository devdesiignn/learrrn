"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/RichTextEditor";
import RichTextPreview from "@/components/RichTextPreview";

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };

  courseID: string;
  chapterID: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Chapter Description is required." }),
});

export default function ChapterDescriptionForm({ initialData, courseID, chapterID }: ChapterDescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  function toggleEdit() {
    setIsEditing((editingState) => !editingState);
  }

  const router = useRouter();

  const initialFormValues = {
    description: initialData.description ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  const { isSubmitting, isValid } = form.formState;

  async function _onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/courses/${courseID}/chapters/${chapterID}`, formValues);

      toast.success("Chapter Updated!");
      toggleEdit();

      router.refresh();
    } catch (error) {
      console.log("[CHAPTER DESCRIPTION FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className={cn("text-base mt-2", !initialData.description && "text-slate-500 italic")}>
          {<RichTextPreview value={initialData.description} /> ?? "No description"}
        </div>
      )}
    </div>
  );
}
