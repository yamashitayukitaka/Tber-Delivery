import Link from 'next/link'
import React from 'react'


import AddressModal from './address-modal';
import { fetchLocation } from '@/lib/restaurants/api';
import Cart from './cart';
import PlaceSearchBar from './place-search-bar';
import MenuSheet from './menu-sheet';



type HeaderProps = {
  isHome?: boolean;
};

const Header = async ({ isHome }: HeaderProps) => {
  const { lat, lng } = await fetchLocation();

  if (isHome) {
    // 🟢 トップページ用
    return (
      <header className=" h-16 fixed top-0 left-0 w-full z-50">
        <div className="flex items-center h-full space-x-4 px-4 max-w-[1920px] mx-auto">
          <MenuSheet />
          <div className="font-bold">
            <Link href="/">Delivery APP</Link>
          </div>
          <div className="flex flex-col gap-2 flex-1 pt-8">
            <PlaceSearchBar lat={lat} lng={lng} />
            <AddressModal />
          </div>
          <Cart />
        </div>
      </header>
    );
  }

  // 🔵 それ以外のページ用
  return (
    <header className=" h-16 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center h-full space-x-4 px-4 max-w-[1920px] mx-auto">
        <MenuSheet />
        <div className="font-bold">
          <Link href="/">Delivery APP</Link>
        </div>

        <AddressModal />
        <div className="flex-1">
          <PlaceSearchBar lat={lat} lng={lng} />
        </div>

        <Cart />
      </div>
    </header>
  );
};

export default Header;
