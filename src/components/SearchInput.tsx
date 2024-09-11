"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryID = searchParams.get("categoryID");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryID: currentCategoryID,
          title: debouncedSearchQuery,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [currentCategoryID, debouncedSearchQuery, pathname, router]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute left-3 top-3 text-slate-600" />

      <Input
        className="w-full md:w-[400px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course..."
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
      />
    </div>
  );
}
