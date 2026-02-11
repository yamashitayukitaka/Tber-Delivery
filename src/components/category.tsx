'use client';

import Image from "next/image";
import { CategoryType } from "./categories";
import { cn } from "@/lib/utils";


interface CategoryProps {
  category: CategoryType;
  onClick: (category: string) => void;
  select: boolean;
}

export default function Category({ category, onClick, select }: CategoryProps) {
  return (
    <div onClick={() => onClick(category.type)} className="cursor-pointer">
      <div className={cn("relative aspect-square overflow-hidden rounded-full", select && "bg-green-200")}>
        <Image
          className="object-cover scale-75"
          src={category.imageUrl}
          alt={category.categoryName}
          fill
          sizes="(max-width:1280px) 100px, 97px"
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-xs truncate">{category.categoryName}</p>
      </div>
    </div>
  );
} 