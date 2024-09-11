import { database } from "@/lib/database";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";
import { getCourses } from "@/actions/getCourses";
import { fetchUserID } from "@/lib/fetchUserID";
import CoursesList from "@/components/CoursesList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryID: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const userID = fetchUserID();

  const categories = await database.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userID, ...searchParams });
  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
        <Categories items={categories} />

        <CoursesList items={courses} />
      </div>
    </>
  );
}
