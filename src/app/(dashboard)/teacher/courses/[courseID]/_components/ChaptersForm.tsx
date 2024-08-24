"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };

  courseID: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Chapter Title is required." }),
});

export default function ChaptersForm({ initialData, courseID }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  function toggleCreating() {
    setIsCreating((editingState) => !editingState);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function _onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseID}/chapters`, formValues);

      toast.success("Chapter Created!");
      toggleCreating();

      router.refresh();
    } catch (error) {
      console.log("[CHAPTERS FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g Introduction to the course" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div>
          <p className={cn("text-sm mt-2", !initialData.chapters.length && "text-slate-500 italic")}>
            {!initialData.chapters.length && "No Chapters"}

            {/* TODO: Add a list of chapters */}
          </p>

          <p className="text-sm text-muted-foreground mt-4">Drag and drop to reorder the chapters</p>
        </div>
      )}
    </div>
  );
}
