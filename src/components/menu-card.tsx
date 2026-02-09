'use client'
import Image from "next/image";
import { Menu } from "@/types";

interface MenuCardProps {
  menu: Menu;
  onClick?: (menu: Menu) => void;
}


export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <div onClick={() => onClick?.(menu)} className="cursor-pointer">

      <div className="relative aspect-5/6 overflow-hidden">
        <Image
          src={menu.photoUrl}
          className="object-cover w-full h-full"
          alt={menu.name}
          fill
          sizes="(max-width: 1280px) 18.75vw, 240px"
        />
        <div className="absolute  bg-black/60 text-white bottom-0 w-full px-2">
          <p className="font-bold  truncate text-sm">{menu.name}</p>
          <p className="text-muted-foreground">
            <span className="text-sm text-white font-bold">￥{menu.price}</span>
          </p>
        </div>
      </div>
    </div>
  )
}