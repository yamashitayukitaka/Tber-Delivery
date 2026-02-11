'use client'
import { cn } from "@/lib/utils"
// ✅onClickはクライアントコンポーネントでしか使えない

import { categoryMenu } from "@/types"

interface CategorySidebarProps {
  categoryMenus: categoryMenu[]
  onSelectCategory: (categoryId: string) => void
  activeCategoryId: string
}

export default function CategorySidebar({ categoryMenus, onSelectCategory, activeCategoryId }: CategorySidebarProps) {
  return (
    <aside className="w-1/4  sticky top-16 z-50 h-[calc(100vh-64px)] max-xl:w-full max-xl:top-25 max-xl:h-fit bg-white max-md:static max-md:z-0 max-md:hidden">
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul className="max-xl:flex">
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button onClick={() => onSelectCategory(category.id)} className={cn(
                'w-full p-4 text-left border-l-4 transition-colors',
                activeCategoryId === category.id ? 'bg-input font-medium  border-primary' : 'hover:bg-muted border-transparent')} type="button">
                {category.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside >
  )
}