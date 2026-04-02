import Link from 'next/link'
import { fetchLocation } from '@/lib/restaurants/api';
import Cart from './cart';
import MenuSheet from './menu-sheet';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import NavActionGroup from './nav-action-group';
import HeaderHeightSetter from './header-height-setter';

const Header = async ({ showNav }: { showNav?: boolean }) => {
  let lat: number | null = null;
  let lng: number | null = null;
  if (showNav) {
    const location = await fetchLocation();
    // 2. 外側の変数に代入（constをつけない！）
    lat = location.lat;
    lng = location.lng;
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()


  return (
    <HeaderHeightSetter enable={showNav}>
      <div className="flex py-4 space-x-4 px-4 items-center">
        <MenuSheet />
        <div className='w-[90%] flex mx-auto gap-5 max-md:flex-col items-center'>
          <div className="font-bold">
            <Link href="/">
              <Image
                src="/images/header/img01.png"
                alt="Tber-Delivery"
                width={200}
                height={200}
                priority
              />
            </Link>
          </div>

          {/* デスクトップ用 (md以上で表示) */}
          {showNav && lat !== null && lng !== null && (
            <div className="block max-lg:hidden w-full">
              <NavActionGroup
                lat={lat}
                lng={lng}
                user={user}
              />
            </div>
          )}
        </div>
        <Cart />
      </div>
      {/* モバイル用 (md未満で表示) */}
      {showNav && lat !== null && lng !== null && (
        <div className="block lg:hidden w-[92%] m-auto mb-5">
          <NavActionGroup
            lat={lat}
            lng={lng}
            user={user}
          />
        </div>
      )}
    </HeaderHeightSetter>
  );
};

export default Header;
