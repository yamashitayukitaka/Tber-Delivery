import Link from 'next/link'

import AddressModal from './address-modal';
import { fetchLocation } from '@/lib/restaurants/api';
import Cart from './cart';
import PlaceSearchBar from './place-search-bar';
import MenuSheet from './menu-sheet';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';

const Header = async () => {
  const { lat, lng } = await fetchLocation();
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className=" h-16 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center h-full space-x-4 px-4 max-w-[1920px] mx-auto">
        <MenuSheet />
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

        <AddressModal />
        <div className="flex-1">
          <PlaceSearchBar lat={lat} lng={lng} />
        </div>
        {!user ? (
          <Link href="/login"
            className=" inline-flex 
                items-center 
                justify-center 
                gap-2 
                px-4 py-2 
                rounded-md 
                bg-green-600
                text-white 
                font-medium 
                hover:bg-green-500
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-400 
                cursor-pointer">
            ログイン・新規登録
          </Link>
        ) : null}
        <Cart />
      </div>
    </header>
  );
};

export default Header;
