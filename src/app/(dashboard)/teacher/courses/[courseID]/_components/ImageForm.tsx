"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

interface ImageFormProps {
  initialData: {
    imageURL: string | null;
  };

  courseID: string;
}

const formSchema = z.object({
  imageURL: z.string().min(1, { message: "Image is required." }),
});

export default function ImageForm({ initialData, courseID }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  function toggleEdit() {
    setIsEditing((editingState) => !editingState);
  }

  const router = useRouter();

  async function _onSubmit(formValues: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/courses/${courseID}`, formValues);

      toast.success("Course Updated!");
      toggleEdit();

      router.refresh();
    } catch (error) {
      console.log("[IMAGE FORM]", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : initialData.imageURL ? (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Image
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an Image
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(imageURL) => {
              if (imageURL) {
                _onSubmit({ imageURL });
              }
            }}
          />

          <div className="text-sm text-muted-foreground mt-4">16:9 aspect ration recommended</div>
        </div>
      ) : initialData.imageURL ? (
        <div className="relative aspect-video mt-4">
          <Image alt="Upload" fill className="object-cover rounded-md" src={initialData.imageURL} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
          <ImageIcon className="h-8 w-8 text-slate-500" />
        </div>
      )}
    </div>
  );
}
