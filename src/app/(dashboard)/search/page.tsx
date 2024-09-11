import { database } from "@/lib/database";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";

export default async function SearchPage() {
  const categories = await database.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6 ">
        <Categories items={categories} />
      </div>
    </>
  );
}
