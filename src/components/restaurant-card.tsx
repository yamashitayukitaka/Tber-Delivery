import Image from 'next/image'
import { Restaurant } from "@/types";
import Link from 'next/link';
interface RestaurantCardProps {
  restaurant: Restaurant;
  averageStar?: number;
}

export default function RestaurantCard({ restaurant, averageStar }: RestaurantCardProps) {
  console.log("Rendering RestaurantCard for:", restaurant.restaurantName, "with average star:", averageStar);
  return (
    <div className='relative'>
      <Link href={`/restaurant/${restaurant.id}`} className='inset-0 absolute z-20 block'></Link>
      <div className="relative aspect-5/4 overflow-hidden">
        <Image
          className='object-cover'
          src={restaurant?.photoUrl}
          fill
          alt="restaurant image"
          sizes="(max-width:1280px) 25vw, 280px"
        />
      </div>

      {averageStar && (
        <div className='flex absolute w-full top-0 left-0 right-0 px-2 bg-black/60 text-white z-10'>
          <p className="font-bold text-white w-[30%]">
            評価: {averageStar}
          </p>

          <div className="flex  gap-1 w-[60%]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= averageStar
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="w-full">
        <p className='font-bold  bg-black/60 text-white w-full px-2'>{restaurant?.restaurantName}</p>
      </div>

    </div>
  )
}


