"use client";

import { Category } from "@prisma/client";
import {
  FcBiotech,
  FcCalculator,
  FcComments,
  FcConferenceCall,
  FcLandscape,
  FcLibrary,
  FcMultipleDevices,
  FcOldTimeCamera,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";

import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Photography: FcOldTimeCamera,
  "Computer Science": FcMultipleDevices,
  Mathematics: FcCalculator,
  Medicine: FcBiotech,
  History: FcLibrary,
  Language: FcComments,
  Religion: FcConferenceCall,
  Agriculture: FcLandscape,
};

export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
      ))}
    </div>
  );
}
