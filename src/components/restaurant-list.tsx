import RestaurantCard from "./restaurant-card";
import { AverageStar, Restaurant } from "@/types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  averageStars?: AverageStar[]
}

export default function RestaurantList({ restaurants, averageStars }: RestaurantListProps) {
  return (
    <ul className="grid grid-cols-4 gap-4 max-[1200px]:grid-cols-2">
      {restaurants.map((restaurant) => {
        const starData = averageStars?.find(
          (s) => s.restaurant_id === restaurant.id
        );
        return (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} averageStar={starData?.averageStar} />
        );
      })}
    </ul>
  );
}
