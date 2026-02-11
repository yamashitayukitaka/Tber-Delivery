import { getPlaceDetails } from '@/lib/restaurants/api';
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from "next/server";
import { Cart } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient()
    const bucket = supabase.storage.from('menus')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { message: 'ユーザーが認証されていません' },
        { status: 401 }
      )
    }
    const { data: carts, error: cartError } = await supabase
      .from('carts')
      .select('cart_items(quantity,id,menus(id,name,price,image_path)),restaurant_id,id')
      .eq('user_id', user.id)
      .order('id', { referencedTable: 'cart_items', ascending: false })
    if (cartError) {
      console.error('カートデータを取得できませんでした。', cartError);
      return NextResponse.json(
        { error: 'カートデータを取得できませんでした。' },
        { status: 500 }
      )
    }

    const promises = carts.map(async (cart): Promise<Cart> => {
      const { data: restaurantData, error } = await getPlaceDetails(cart.restaurant_id, ['displayName', 'photos'])

      if (!restaurantData || error) {
        console.error(`レストランデータの取得に失敗しました。${error}`);
      }
      return {
        ...cart,
        cart_items: cart.cart_items.map((item) => {
          const { image_path, ...restMenus } = item.menus;
          const publicUrl = bucket.getPublicUrl(item.menus.image_path).data.publicUrl
          return {
            ...item,
            menus: {
              ...restMenus,
              photoUrl: publicUrl,
            },
          };
        }),
        restaurantName: restaurantData?.displayName ?? '不明なお店',
        photoUrl: restaurantData?.photoUrl ?? '/no_image.png',
      };
    });

    const results = await Promise.all(promises)
    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}
