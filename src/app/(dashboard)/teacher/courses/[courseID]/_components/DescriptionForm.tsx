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
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  initialData: {
    description: string | null;
  };

  courseID: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required." }),
});

export default function DescriptionForm({ initialData, courseID }: DescriptionFormProps) {
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
      await axios.patch(`/api/courses/${courseID}`, formValues);

      toast.success("Course Updated!");
      toggleEdit();

      router.refresh();
    } catch (error) {
      console.log("[DESCRIPTION FORM]", error);
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
                    <Textarea disabled={isSubmitting} placeholder="e.g This course is about..." {...field} />
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
        <p className={cn("text-base mt-2", !initialData.description && "text-slate-500 italic")}>
          {initialData.description ?? "No description"}
        </p>
      )}
    </div>
  );
}
