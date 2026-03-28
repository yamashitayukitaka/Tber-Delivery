import Section from "@/components/section";
import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import { fetchLocation, fetchRamenRestaurants } from "@/lib/restaurants/api"
import { fetchRestaurants } from "@/lib/restaurants/api"
import RestaurantList from "@/components/restaurant-list";
import Categories from "@/components/categories";
import { fetchMenus } from "@/lib/menus/api";
import MenuList from "@/components/menu-list";
import MenuCard from "@/components/menu-card";
import Image from "next/image";
import { getAverageStars } from "@/lib/comments/api";
import { MapPlace } from "@/types";
import MapContent from "@/components/map-content";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// スタイルシートのインポートを忘れずに
import 'swiper/css';
import MainVisual from "@/components/main-visual";



export default async function Home() {
  const { lat, lng } = await fetchLocation();
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantError } = await fetchRamenRestaurants(lat, lng);
  const { data: nearbyRestaurants, error: restaurantsError } = await fetchRestaurants(lat, lng);
  // どちらの配列もMapPlace型に変換
  const ramenPlaces: MapPlace[] = nearbyRamenRestaurants
    ?.filter(r => r.location?.latitude != null && r.location?.longitude != null)
    .map(r => ({
      id: r.id,
      restaurantName: r.restaurantName || '',
      lat: r.location?.latitude!,
      lng: r.location?.longitude!,
      photoUrl: r.photoUrl,
    })) || [];

  const otherPlaces: MapPlace[] = nearbyRestaurants
    ?.filter(r => r.location?.latitude != null && r.location?.longitude != null)
    .map(r => ({
      id: r.id,
      restaurantName: r.restaurantName || '',
      lat: r.location?.latitude!,
      lng: r.location?.longitude!,
      photoUrl: r.photoUrl,
    })) || [];

  // ramenPlaces と otherPlaces は MapPlace[]
  const allPlaces = [...ramenPlaces, ...otherPlaces];

  // id で重複を除く
  const mapPlaces: MapPlace[] = Object.values(
    allPlaces.reduce<Record<string, MapPlace>>((acc, place) => {
      if (!acc[place.id]) {
        acc[place.id] = place;
      }
      return acc;
    }, {})
  );

  const restaurant = nearbyRamenRestaurants?.[0];
  const primaryType = restaurant?.primaryType;
  const nearbyRestaurantsIds = nearbyRestaurants?.map(r => r.id) || [];
  const nearbyRamenRestaurantsIds = nearbyRamenRestaurants?.map(r => r.id) || [];
  const { averageStars, error } = await getAverageStars(nearbyRestaurantsIds);
  if (error) {
    console.error("averageStars error:", error);
  }
  const { averageStars: ramenAverageStars, error: ramenAverageStarsError } = await getAverageStars(nearbyRamenRestaurantsIds);
  if (ramenAverageStarsError) {
    console.error("ramenAverageStars error:", ramenAverageStarsError);
  }
  const { data: menus, error: menusError } = primaryType ? await fetchMenus(primaryType) : { data: [] };
  return (
    <div className="pt-[78px] max-xl:pt-32 max-md:pt-[201px]">
      <MainVisual />

      <div className="max-w-7xl mx-auto px-10">
        <h3 className="flex justify-center items-center font-bold text-[28px] max-md:text-[24px] h-[85px]">
          近くの飲食店を地図から探す
        </h3>
        <MapContent lat={lat} lng={lng} places={mapPlaces} />
        <div className="mb-25">
          <Categories />
        </div>
      </div>

      <div className="relative py-10">
        <Image
          className="object-cover -z-10"
          id="main-visual"
          src="/images/top/img01.png"
          alt="背景画像"
          fill
          priority
          sizes="(max-width:1280px) 100vw, 1920px"
        />
        {/* レストラン情報表示 */}
        <div className="max-w-7xl mx-auto px-10">
          {!nearbyRestaurants ? (
            <p>{restaurantsError}</p>
          ) : nearbyRestaurants.length > 0 ? (
            <Section title="近くのお店" expandedContent={<RestaurantList restaurants={nearbyRestaurants} averageStars={averageStars} />}>
              <CarouselContainer slideToShow={4}>
                {nearbyRestaurants.map((restaurant) => {
                  const starData = averageStars?.find(
                    (s) => s.restaurant_id === restaurant.id
                  );
                  return (
                    <RestaurantCard restaurant={restaurant} key={restaurant.id} averageStar={starData?.averageStar} />
                  );
                })}
              </CarouselContainer>
            </Section>
          ) : (
            <p>近くにレストランがありません</p>
          )}


          {/* ラーメン店情報表示 */}
          {!nearbyRamenRestaurants ? (
            <p>{nearbyRamenRestaurantError}</p>
          ) : nearbyRamenRestaurants.length > 0 ? (

            <Section title="近くのラーメン店" expandedContent={<RestaurantList restaurants={nearbyRamenRestaurants} averageStars={ramenAverageStars} />}>
              <CarouselContainer slideToShow={4}>
                {nearbyRamenRestaurants.map((restaurant) => {
                  const starData = ramenAverageStars?.find(
                    (s) => s.restaurant_id === restaurant.id
                  );
                  return (
                    <RestaurantCard restaurant={restaurant} key={restaurant.id} averageStar={starData?.averageStar} />
                  );
                })}
              </CarouselContainer>
            </Section>

          ) : (
            <p>近くにラーメン店がありません</p>
          )}
          {/* メニュー情報表示 */}
          {!menus ? (
            <p>{menusError}</p>
          ) : menus.length > 0 && restaurant ? (
            <Section
              title={restaurant?.restaurantName}
              expandedContent={<MenuList menus={menus} />}
            >
              <CarouselContainer slideToShow={6}>
                {menus.map((menu) => (
                  <MenuCard
                    menu={menu}
                  />
                ))}
              </CarouselContainer>
            </Section>
          ) : (
            <p>メニューがありません</p>
          )}
        </div>
      </div>
    </div>
  );
}
