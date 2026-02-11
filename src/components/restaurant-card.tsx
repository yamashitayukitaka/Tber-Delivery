import Image from 'next/image'
import { Restaurant } from "@/types";
import Link from 'next/link';
interface RestaurantCardProps {
  restaurant: Restaurant;

}

export default async function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className='relative'>
      <Link href={`/restaurant/${restaurant.id}`} className='inset-0 absolute z-10'></Link>
      <div className="relative aspect-5/4 overflow-hidden">
        <Image
          className='object-cover'
          src={restaurant?.photoUrl}
          fill
          alt="restaurant image"
          sizes="(max-width:1280px) 25vw, 280px"
        />
      </div>
      <div className="w-full">
        <p className='font-bold  bg-black/60 text-white w-full px-2'>{restaurant?.restaurantName}</p>
      </div>
      <div className='flex justify-between'>
      </div>
    </div>
  )
}


