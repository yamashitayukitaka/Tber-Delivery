'use client'
import Image from "next/image";
import { Menu } from "@/types";
import { Card } from "./ui/card";

interface FlatMenuCardProps {
  menu: Menu;
  onClick?: (menu: Menu) => void;
}

export default function FlatMenuCard({ menu, onClick }: FlatMenuCardProps) {
  return (
    <Card className="p-0 overflow-hidden cursor-pointer" onClick={() => onClick?.(menu)}>
      <div className="flex flex-1 max-md:flex-col-reverse">
        <div className="w-2/5 p-4  bg-black/60 text-white max-md:w-full">
          <p className="font-bold">{menu.name}</p>
          <p className="text-white">¥{menu.price}</p>
        </div>
        <div className="w-3/5 relative aspect-5/4 max-md:w-full">
          <Image
            fill
            src={menu.photoUrl}
            alt={menu.name}
            className="object-cover w-full h-full"
            sizes="176px"
          />
        </div>
      </div>
    </Card>
  );
}