'use client';
import { categories } from "@/lib/constants";
import CarouselContainer from "./carousel-container";
import Category from "./category";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export interface CategoryType {
  categoryName: string;
  type: string;
  imageUrl: string;
}

export default function Categories() {

  const searchParams = useSearchParams();
  const router = useRouter();


  const currentCategory = searchParams.get("category")
  const searchRestaurantsOfCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);

    if (currentCategory === category) {
      router.replace('/')
    } else {
      params.set("category", category);
      router.replace(`/search?${params.toString()}`);
    }
  }
  return (
    <div>
      <CarouselContainer slideToShow={10} variant={true}>
        {
          categories.map((category) => (
            <Category
              category={category}
              key={category.type}
              onClick={searchRestaurantsOfCategory}
              select={currentCategory === category.type}
            />
          ))
        }
      </CarouselContainer>
    </div>
  );
}