import Link from 'next/link'
import React from 'react'


import AddressModal from './address-modal';
import { fetchLocation } from '@/lib/restaurants/api';
import Cart from './cart';
import PlaceSearchBar from './place-search-bar';
import MenuSheet from './menu-sheet';
import Image from 'next/image';



type HeaderProps = {
  isHome?: boolean;
};

const Header = async ({ isHome }: HeaderProps) => {
  const { lat, lng } = await fetchLocation();


  if (isHome) {
    // 🟢 トップページ用
    return (
      <header className="relative bg-background h-[600px] w-full">
        {/* 背景 */}
        <div className="absolute inset-0">
          <Image
            className="object-cover"
            src="/images/header/img01.jpg"
            alt="メインビジュアル"
            fill
            priority
            sizes="(max-width:1280px) 100vw, 1920px"
          />
        </div>

        {/* 中身 */}
        <div className="relative z-10 flex items-center space-x-4 px-10 py-4 w-full">
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
  }


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
