import { AverageStar } from "@/types";
import { createClient } from "@/utils/supabase/server";

interface StarData {
  restaurant_id: string;
  star: number;
}

interface GroupedStar {
  restaurant_id: string;
  stars: number[];
}

interface GroupedStar {
  restaurant_id: string;
  stars: number[];
}



export const getAverageStars = async (restaurantIds: string[]) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("star, restaurant_id")
    .in("restaurant_id", restaurantIds)

  if (error) {
    console.error("平均の取得に失敗しました", error);
    return { error: "平均の取得に失敗しました" };
  } else {


    const groupStarsByRestaurant = (data: StarData[]): GroupedStar[] => {
      const map: Record<string, number[]> = {};

      data.forEach(({ restaurant_id, star }) => {
        if (!map[restaurant_id]) map[restaurant_id] = [];
        map[restaurant_id].push(star);
      });

      // オブジェクトを配列に変換
      return Object.entries(map).map(([restaurant_id, stars]) => ({
        restaurant_id,
        stars,
      }));
    };


    const grouped = groupStarsByRestaurant(data);
    console.log('grouped:', grouped);

    const calculateAverageStars = (grouped: GroupedStar[]): AverageStar[] => {
      return grouped.map(({ restaurant_id, stars }) => {
        const sum = stars.reduce((acc, star) => acc + star, 0);
        const avg = sum / stars.length;
        const rounded = Math.round(avg * 10) / 10; // 小数第1位まで丸め
        return {
          restaurant_id,
          averageStar: rounded,
        };
      });
    };

    const averages = calculateAverageStars(grouped);
    return { averageStars: averages };
  }
}