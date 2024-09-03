"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Chapter } from "@prisma/client";

import { Form, FormControl, FormField, FormItem, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChapterAccessFormProps {
  initialData: Chapter;

  courseID: string;
  chapterID: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export default function ChapterAccessForm({ initialData, courseID, chapterID }: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  function toggleEdit() {
    setIsEditing((editingState) => !editingState);
  }

  const router = useRouter();

  const initialFormValues = {
    isFree: Boolean(initialData.isFree),
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
      console.log("[CHAPTER ACCESS FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Access
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(_onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox id="isFree" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>

                  <Label htmlFor="isFree" className="space-y-1 leading-none cursor-pointer text-muted-foreground">
                    Check this box if you want to make this chapter free for preview
                  </Label>
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
        <p className={cn("text-base mt-2", !initialData.isFree && "text-slate-500 italic")}>
          {initialData.isFree ? <>This chapter is free for preview.</> : <>This Chapter is not Free</>}
        </p>
      )}
    </div>
  );
}
