// components/header/nav-action-group.tsx
import Link from 'next/link';
import PlaceSearchBar from './place-search-bar';
import AddressModal from './address-modal';
import { User } from '@supabase/supabase-js';

interface NavActionGroupProps {
  lat: number;
  lng: number;
  user: User | null; // SupabaseのUser型があればそれを指定
}

const NavActionGroup = ({ lat, lng, user }: NavActionGroupProps) => {
  return (
    <div className="flex justify-between gap-5 items-center w-full max-lg:flex-col">
      <div className="w-[70%] max-xl:w-full">
        <PlaceSearchBar lat={lat} lng={lng} />
      </div>
      {!user ? (
        <Link
          href="/login"
          className="inline-flex  justify-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer whitespace-nowrap"
        >
          ログイン・新規登録
        </Link>
      ) : (
        <AddressModal />
      )}
    </div>
  );
};

export default NavActionGroup;