"use client";

import { IconType } from "react-icons/lib";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value?: string;
}

export default function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryID = searchParams.get("categoryID");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryID === value;

  const _onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryID: isSelected ? null : value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={_onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",

        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}>
      {Icon && <Icon size={20} />}

      <div className="truncate">{label}</div>
    </button>
  );
}
