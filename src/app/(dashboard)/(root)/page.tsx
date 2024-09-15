import { getDashboardCourses } from "@/actions/getDashboardCourses";
import CoursesList from "@/components/CoursesList";
import { fetchUserID } from "@/lib/fetchUserID";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/InfoCard";

export default async function DashboardPage() {
  const userID = fetchUserID();

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userID);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={coursesInProgress.length} />

        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses.length} variant="success"/>
      </div>

      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
