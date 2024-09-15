"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchInput from "./SearchInput";
import { isTeacher } from "@/lib/teacher";

export default function NavbarRoutes() {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith(`/teacher`);
  const isStudentPage = pathname?.includes(`/courses`);
  const isSearchPage = pathname === "/search";

  const { userId: userID } = useAuth();

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isStudentPage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"outline"}>
              <LogOut className="h-4 w-4 mr-2" /> Exit
            </Button>
          </Link>
        ) : isTeacher(userID) ? (
          <Link href={`/teacher/courses`}>
            <Button size={"sm"} variant={"outline"}>
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  );
}
