import MenuContent from "@/components/menu-content";
import MenuSearchBar from "@/components/menu-search-bar";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { getPlaceDetails } from "@/lib/restaurants/api";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RestaurantPage({
  params,
  // ✅動的ルーティングの値をURLから取得できる
  searchParams,
  //クエリパラメーターのキーと値を取得できる
}:
  // ✅このとき Next.js が内部で：
  // URL の 動的ルーティング部分 → params
  // URL の クエリパラメーター → searchParams
  // を 自動で解析してデータを引数に渡す。
  // 引数名は他の名前ではだめ
  {
    params: Promise<{ restaurantId: string }>;
    searchParams: Promise<{ sessionToken?: string; searchMenu?: string }>;
  }) {
  const { restaurantId } = await params;
  const { sessionToken, searchMenu } = await searchParams;
  // ✅searchParams にキーが存在しない場合、その値は undefinedになる
  // undefinedも関数に引数に渡せる
  // sessionTokenが存在しない場合はundefinedが渡される

  console.log("searchMenu", searchMenu);

  console.log("restaurantId", restaurantId);
  console.log("sessionToken", sessionToken);



  const { data: restaurant, error: menusError } = await getPlaceDetails(
    restaurantId,
    ["displayName", "photos", "primaryType"],
    sessionToken
  );



  console.log("レストラン", restaurant);

  const primaryType = restaurant?.primaryType
  console.log('primaryType', primaryType)

  const { data: categoryMenus, error: munusError } = primaryType ? await fetchCategoryMenus(primaryType, searchMenu) : { data: [] };


  if (!restaurant) notFound();
  // ✅ notFound() を明示的に呼ぶと 404 に遷移する
  // ✅ この場合 error.tsx は使われない
  // ✅ not-found.tsx があればそれが表示
  // ✅ なければ Next.js デフォルト 404

  return (
    <>
      <div className="pt-[78px] max-xl:pt-32 max-md:pt-[201px]">
        <div className="h-64 shadow-md relative overflow-hidden">
          <Image
            src={restaurant.photoUrl!}
            fill
            alt={restaurant.displayName ?? "レストラン画像"}
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
        </div>

        <div className="mt-4 flex items-center justify-between max-w-7xl mx-auto px-10 max-lg:flex-col max-lg:items-start">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.displayName}</h1>
          </div>

          <div className="flex-1 max-lg:flex-none max-lg:w-[80%] max-sm:w-full">
            <div className="ml-auto w-80 max-lg:w-full"><MenuSearchBar /></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-10">
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

