import { categoryMenu, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";


export async function fetchCategoryMenus(primaryType: string, searchQuery?: string) {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus')
  let query = supabase
    .from('menus')
    .select('*')
    .eq('genre', primaryType)

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }
  const { data: menus, error: menusError } = await query


  if (menusError) {
    console.log('メニューの取得に失敗しました', menusError)
    return { error: 'メニューの取得に失敗しました' }
  }
  console.log('menus', menus);
  if (menus.length === 0) {
    return { data: [] }
  }


  const categoryMenus: categoryMenu[] = []

  if (!searchQuery) {
    const featuredItems = menus
      .filter((menu) => menu.is_featured)
      .map((menu): Menu => ({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
      }));


    categoryMenus.push(
      {
        id: 'featured',
        categoryName: '注目商品',
        items: featuredItems,
      }
    )
  }


  const categories = Array.from(new Set(menus.map((menu) => menu.category)))

  for (const category of categories) {
    const items = menus.filter((menu) => menu.category === category)

      .map((menu): Menu => ({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
      }))
    categoryMenus.push(
      {
        categoryName: category,
        id: category,
        items: items,
      }
    )
  }
  return { data: categoryMenus }
}



export async function fetchMenus(primaryType: string) {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus')

  const { data: menuItems, error: menuItemsError } = await supabase
    .from("menus")
    .select("*")
    .eq("genre", primaryType);

  if (menuItemsError) {
    console.error('メニューの取得に失敗しました', menuItemsError)
    return { error: 'メニューの取得に失敗しました' };
  }

  const menus = menuItems.map((menu): Menu => (
    {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
    }
  ))

  return { data: menus };

}
