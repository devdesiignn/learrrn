import { getAnalytics } from "@/actions/getAnalytics";
import { fetchUserID } from "@/lib/fetchUserID";

import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

export default async function AnalyticsPage() {
  const userID = fetchUserID();

  const { data, totalRevenue, totalSales } = await getAnalytics(userID);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat={true} />

        <DataCard label="Total Sales" value={totalSales} />
      </div>

      <Chart data={data} />
    </div>
  );
}
