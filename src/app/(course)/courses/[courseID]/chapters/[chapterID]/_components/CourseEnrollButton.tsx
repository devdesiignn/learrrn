"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import formatPrice from "@/lib/format";

interface CourseEnrollButtonProps {
  price: number;
  courseID: string;
}

export default function CourseEnrollButton({ courseID, price }: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const _onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseID}/checkout`);

      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="sm" className="w-full md:w-auto" onClick={_onClick} disabled={isLoading}>
      Enroll for {formatPrice(price)}
    </Button>
  );
}
