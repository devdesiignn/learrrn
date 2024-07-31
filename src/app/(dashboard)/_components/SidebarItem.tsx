"use client";

import { Icon, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

// icon: Icon
// Rename icon to Icon to be used as component

export default function SidebarItem({ icon: Icon, href, label }: SidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`);

  const _onClick = () => router.push(href);

  return (
    <button
      onClick={_onClick}
      className={cn(
        "flex items-center gap-x-2 text-sm font-medium pl-6 transition-all text-slate-500 hover:text-slate-600 hover:bg-slate-300/20",

        isActive && "text-sky-700 hover:text-sky-700 bg-sky-200/20 hover:bg-sky-200/20"
      )}>
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={20}
          className={cn(
            "text-slate-500",

            isActive && "text-sky-700"
          )}
        />
        {label}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",

          isActive && "opacity-100"
        )}
      />
    </button>
  );
}
