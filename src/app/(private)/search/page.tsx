import { fetchCategoryRestaurants, fetchLocation, fetchRestaurantsByKeyword } from "@/lib/restaurants/api";
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";
import { redirect } from "next/navigation";
import { MapPlace } from "@/types";
import MapContent from "@/components/map-content";
import { categories } from "@/lib/constants";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, restaurant?: string }>;
}) {


  const { category, restaurant } = await searchParams


  const { lat, lng } = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category, lat, lng);
    const selectedCategory = categories.find(c => c.type === category);
    const categoryMapPlaces: MapPlace[] = categoryRestaurants
      ?.filter(r => r.location?.latitude != null && r.location?.longitude != null)
      .map(r => ({
        id: r.id,
        restaurantName: r.restaurantName || '',
        lat: r.location?.latitude!,
        lng: r.location?.longitude!,
        photoUrl: r.photoUrl,
      })) || [];

    return (
      <div className="py-[77px] max-xl:py-32 max-md:py-[201.13px]">

        <div className="max-w-7xl mx-auto px-10 py-5">
          <div className="mb-4">
            <h3 className="text-center font-bold text-[28px] max-md:text-[24px]">近くの{selectedCategory?.categoryName}店を地図から探す</h3>
            <Categories />
          </div>
          <MapContent lat={lat} lng={lng} places={categoryMapPlaces} />
          {!categoryRestaurants ? (
            <p className="text-destructive">{fetchError}</p>
          ) : categoryRestaurants.length > 0 ? (
            <>
              <h3 className="text-center font-bold text-[28px] max-md:text-[24px]">近くの{selectedCategory?.categoryName}店をリストから探す</h3>
              <RestaurantList restaurants={categoryRestaurants} />
            </>
          ) : (
            <p>
              カテゴリ<strong>{selectedCategory?.categoryName}</strong>
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
        photoUrl: r.photoUrl,
      })) || [];
    return (
      <>
        <div className="max-w-7xl mx-auto px-10 py-24">
          <h3 className="text-center font-bold text-[28px] max-md:text-[24px]">近くの{restaurant}を地図から探す</h3>
          <MapContent lat={lat} lng={lng} places={keywordMapPlaces} />
          {!restaurants ? (
            <p className="text-destructive">{fetchError}</p>
          ) : restaurants.length > 0 ? (
            <>
              <h3 className="text-center font-bold text-[28px] max-md:text-[24px]">近くの{restaurant}をリストから探す</h3>
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