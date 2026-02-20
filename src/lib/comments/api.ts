import { createClient } from "@/utils/supabase/server";

export const getAverageStar = async (restaurantId: string) => {
  const supabase = await createClient();

  const { data, error: AverageStarError } = await supabase
    .from("comments")
    .select("star")
    .eq("restaurant_id", restaurantId)

  if (AverageStarError) {
    console.error("平均の取得に失敗しました", AverageStarError);
    return { error: "平均の取得に失敗しました" };
  }

  return { data };
}


