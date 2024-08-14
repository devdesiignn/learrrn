"use client";

import { ClientUploadedFileData } from "uploadthing/types";
import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;

  endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({ onChange, endpoint }: FileUploadProps) {
  function _handleOnChange(result: ClientUploadedFileData<null>[]) {
    onChange(result?.[0].url);
  }

  function _handleError(error: Error) {
    console.log("[FILE UPLOAD]", error);

    toast.error("Something went wrong!");
  }

  return <UploadDropzone endpoint={endpoint} onClientUploadComplete={_handleOnChange} onUploadError={_handleError} />;
}
