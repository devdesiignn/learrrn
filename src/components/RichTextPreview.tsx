"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface RichTextPreviewProps {
  value: string | null;
}

export default function RichTextPreview({ value }: RichTextPreviewProps) {
  // IMPORTING REACTQUILL DYNAMICALLY TO AVOID HYDRATION ERROR
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  // SNEAKY FIX
  if (!value) return null;

  return (
    <div className="bg-white">
      <ReactQuill theme="bubble" value={value} readOnly />
    </div>
  );
}
