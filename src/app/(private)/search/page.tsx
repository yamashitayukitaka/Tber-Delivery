import { fetchCategoryRestaurants, fetchLocation, fetchRestaurantsByKeyword } from "@/lib/restaurants/api";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";
import { redirect } from "next/navigation";
import { MapPlace } from "@/types";
import MapContent from "@/components/map-content";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, restaurant?: string }>;
}) {


  const { category, restaurant } = await searchParams
  const { lat, lng } = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category, lat, lng);
    const categoryMapPlaces: MapPlace[] = categoryRestaurants
      ?.filter(r => r.location?.latitude != null && r.location?.longitude != null)
      .map(r => ({
        id: r.id,
        restaurantName: r.restaurantName || '',
        lat: r.location?.latitude!,
        lng: r.location?.longitude!,
      })) || [];

    return (
      <div className="py-[77px] max-xl:py-32 max-md:py-[201.13px]">
        <MapContent lat={lat} lng={lng} places={categoryMapPlaces} />
        <div className="max-w-7xl mx-auto px-10 py-5">

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
      </div>
    );
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } = await fetchRestaurantsByKeyword(restaurant, lat, lng);
    const keywordMapPlaces: MapPlace[] = restaurants
      ?.filter(r => r.location?.latitude != null && r.location?.longitude != null)
      .map(r => ({
        id: r.id,
        restaurantName: r.restaurantName || '',
        lat: r.location?.latitude!,
        lng: r.location?.longitude!,
      })) || [];
    return (
      <>
        <MapContent lat={lat} lng={lng} places={keywordMapPlaces} />
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
      </>
    );
  } else {
    redirect(('/'))
  }
}