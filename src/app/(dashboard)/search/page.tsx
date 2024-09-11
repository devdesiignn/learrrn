import { database } from "@/lib/database";
import Categories from "./_components/Categories";

export default async function SearchPage() {
  const categories = await database.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6 ">
      <Categories items={categories} />
    </div>
  );
}
