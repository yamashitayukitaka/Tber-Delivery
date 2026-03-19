import CommentsAverage from "@/components/average-star";
import CommentsContainer from "@/components/comments-container";
import MapContent from "@/components/map-content";
import MenuContent from "@/components/menu-content";
import MenuSearchBar from "@/components/menu-search-bar";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { fetchLocation, getPlaceDetails } from "@/lib/restaurants/api";
import { MapPlace } from "@/types";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ sessionToken?: string; searchMenu?: string }>;
}) {
  const { restaurantId } = await params;
  const { sessionToken, searchMenu } = await searchParams;
  const { data: restaurant, error: menusError } = await getPlaceDetails(
    restaurantId,
    ["displayName", "photos", "primaryType", "location"],
    sessionToken
  );

  console.log('singleRestaurant', restaurant)
  const { lat, lng } = await fetchLocation();

  const singleMapPlace: MapPlace = {
    id: restaurantId,
    restaurantName: restaurant?.displayName,
    lat: restaurant?.location?.latitude,
    lng: restaurant?.location?.longitude,
    photoUrl: restaurant?.photoUrl,
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const primaryType = restaurant?.primaryType
  const { data: categoryMenus, error: munusError } = primaryType ? await fetchCategoryMenus(primaryType, searchMenu) : { data: [] };
  if (!restaurant) notFound();



  return (
    <>
      <div className="pt-[78px] max-xl:pt-32 max-md:pt-[201px]">
        <div className="h-[600px] shadow-md relative overflow-hidden">
          <Image
            src={restaurant.photoUrl!}
            fill
            alt={restaurant.displayName ?? "レストラン画像"}
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <div className="absolute left-[8%] top-[95%]  transform -translate-y-full bg-black/60 inline-block py-2 px-3.5">
            <h1 className="text-3xl font-bold text-white">{restaurant.displayName}</h1>
            <CommentsAverage restaurantId={restaurantId} />
          </div>
        </div>
        <MapContent lat={lat} lng={lng} singlePlace={singleMapPlace} />
        <div className="mt-4 flex mb-6 items-center justify-between max-w-7xl mx-auto px-10 max-lg:flex-col max-lg:items-start">
          <div className="flex-1 max-lg:flex-none max-lg:w-[80%] max-sm:w-full">
            <div className="ml-auto w-80 max-lg:w-full"><MenuSearchBar /></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-10">
        <CommentsContainer restaurantId={restaurantId} user={user?.id ?? null} />
        {!categoryMenus ? (
          <p>{menusError}</p>
        ) : categoryMenus.length > 0 ?
          (<MenuContent
            categoryMenus={categoryMenus}
            restaurantId={restaurantId}
          />) : (<p>メニューが見つかりません</p>)
        }
      </div>
    </>
  );
}

