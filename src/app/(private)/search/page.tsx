import { fetchCategoryRestaurants, fetchLocation, fetchRestaurantsByKeyword } from "@/lib/restaurants/api";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";
import { redirect } from "next/navigation";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, restaurant?: string }>;
}) {


  const { category, restaurant } = await searchParams
  const { lat, lng } = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category, lat, lng);
    return (
      <div className="max-w-7xl mx-auto px-10 py-24">
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p>
            カテゴリ<strong>{category}</strong>
            に一致するレストランが見つかりません
            ✅
          </p>
        )}
      </div>
    );
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } = await fetchRestaurantsByKeyword(restaurant, lat, lng);
    return (
      <div className="max-w-7xl mx-auto px-10 py-24">
        <div className="mb-4">
          <Categories />
        </div>
        {!restaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : restaurants.length > 0 ? (
          <>
            <div className="mb-4">
              {restaurant}の検索結果は{restaurants?.length}件です
            </div>
            <RestaurantList restaurants={restaurants} />
          </>
        ) : (
          <p>
            <strong>{restaurant}</strong>に一致するレストランが見つかりません
          </p>
        )}
      </div>
    );
  } else {
    redirect(('/'))
  }
}