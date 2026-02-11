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

export default async function Home() {
  const { lat, lng } = await fetchLocation();
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantError } = await fetchRamenRestaurants(lat, lng);
  const { data: nearbyRestaurants, error: restaurantsError } = await fetchRestaurants(lat, lng);
  const restaurant = nearbyRamenRestaurants?.[0];
  const primaryType = restaurant?.primaryType;
  console.log('primaryType', primaryType)
  const { data: menus, error: menusError } = primaryType ? await fetchMenus(primaryType) : { data: [] };
  return (
    <div className="pt-[78px] max-xl:pt-32 max-md:pt-[201px]">
      <div className="h-[600px] overflow-hidden relative">
        <Image
          className="object-cover"
          src="/images/header/img01.jpg"
          alt="メインビジュアル"
          fill
          priority
          sizes="(max-width:1280px) 100vw, 1920px"
        />
      </div>

      <div className="max-w-7xl mx-auto px-10 py-5">
        <Categories />
      </div>

      <div className="relative py-10">
        <Image
          className="object-cover -z-10"
          id="main-visual"
          src="/images/top/img01.png"
          alt="メインビジュアル"
          fill
          priority
          sizes="(max-width:1280px) 100vw, 1920px"
        />
        {/* レストラン情報表示 */}
        <div className="max-w-7xl mx-auto px-10">
          {!nearbyRestaurants ? (
            <p>{restaurantsError}</p>
          ) : nearbyRestaurants.length > 0 ? (
            <Section title="近くのお店" expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}>
              <CarouselContainer slideToShow={4}>
                {nearbyRestaurants.map((restaurant) => (
                  <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                ))}
              </CarouselContainer>
            </Section>
          ) : (
            <p>近くにレストランがありません</p>
          )}


          {/* ラーメン店情報表示 */}
          {!nearbyRamenRestaurants ? (
            <p>{nearbyRamenRestaurantError}</p>
          ) : nearbyRamenRestaurants.length > 0 ? (

            <Section title="近くのラーメン店" expandedContent={<RestaurantList restaurants={nearbyRamenRestaurants} />}>
              <CarouselContainer slideToShow={4}>
                {nearbyRamenRestaurants.map((restaurant) => (
                  <RestaurantCard restaurant={restaurant} key={restaurant.id} />
                ))}
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
