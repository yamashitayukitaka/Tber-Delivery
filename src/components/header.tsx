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
    <header className="fixed top-0 left-0 w-full z-50 bg-white">
      <div className="flex py-4 space-x-4 px-4 max-w-[1920px] mx-auto items-center max-xl:items-start">
        <MenuSheet />
        <div className='w-[90%] flex mx-auto gap-5 max-md:flex-col items-center max-xl:items-start'>
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

          <div className='flex justify-between gap-5 items-center w-full max-xl:flex-col'>
            <div className='w-[70%] max-xl:w-full'>
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
            ) : <AddressModal />}
          </div>
        </div>
        <Cart />
      </div>
    </header>
  );
};

export default Header;
