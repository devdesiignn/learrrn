import { database } from "@/lib/database";
import { Course, Purchase } from "@prisma/client";

type Purchase_Course = Purchase & {
  course: Course;
};

function groupByCourse(purchases: Purchase_Course[]) {
  const grouped: {
    [courseTitle: string]: number;
  } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
}

export async function getAnalytics(userID: string) {
  try {
    const purchases = await database.purchase.findMany({
      where: {
        course: {
          userID,
        },
      },

      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(([couresTitle, total]) => ({
      name: couresTitle,
      total,
    }));

    const totalRevenue = data.reduce((sum, current) => sum + current.total, 0);
    const totalSales = purchases.length;

    return { data, totalRevenue, totalSales };
  } catch (error) {
    console.log("[GET ANALYTICS]", error);

    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
}
