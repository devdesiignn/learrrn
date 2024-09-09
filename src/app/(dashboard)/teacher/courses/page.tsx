import { DataTable } from "./_components/DataTable";
import { Columns } from "./_components/Columns";
import { fetchUserID } from "@/lib/fetchUserID";
import { database } from "@/lib/database";

export default async function CoursesPage() {
  const userID = fetchUserID();

  const courses = await database.course.findMany({
    where: {
      userID,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={Columns} data={courses} />
    </div>
  );
}
