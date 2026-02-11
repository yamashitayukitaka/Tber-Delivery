'use client'
import CategorySidebar from "./category-sidebar";
import { categoryMenu } from "@/types";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";
import { useState } from "react";
import { InView } from "react-intersection-observer";
import MenuModal from "./menu-modal";
import { useModal } from "@/app/context/modalContext";
import { useCartVisibility } from "@/app/context/cartContext";
import { useCart } from "@/hooks/cart/useCart";


interface MenuContentProps {
  categoryMenus: categoryMenu[];
  restaurantId: string
}

export default function MenuContent({ categoryMenus, restaurantId }: MenuContentProps) {
  const { isOpen, openModal, closeModal, selectedItem } = useModal()
  const { targetCart, mutateCart } = useCart(restaurantId, false);
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id)
  const { openCart } = useCartVisibility();

  const handleSelectCategory = (categoryId: string) => {
    console.log(categoryId)
    const element = document.getElementById(`${categoryId}-menu`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveCategoryId(categoryId)
    }
  }

  return (
    <div className="flex gap-4 max-xl:flex-col">
      <CategorySidebar
        categoryMenus={categoryMenus}
        onSelectCategory={handleSelectCategory}
        activeCategoryId={activeCategoryId}
      />
      <div className="w-3/4 max-xl:w-full">
        {categoryMenus.map((category) => (
          <InView
            className="scroll-mt-16"
            id={`${category.id}-menu`}
            key={category.id}
            as="div"
            threshold={0.7}
            onChange={(inView) => inView && setActiveCategoryId(category.id)
            }
          >
            <Section title={category.categoryName}>
              {category.id === 'featured' ? (
                <CarouselContainer slideToShow={4}>
                  {category.items.map((menu) => (
                    <MenuCard
                      menu={menu}
                      onClick={openModal}
                    />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard
                      menu={menu}
                      key={menu.id}
                      onClick={openModal}
                    />
                  ))}
                </div>
              )
              }
            </Section>
          </InView>
        ))}
      </div>
      <MenuModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
        restaurantId={restaurantId}
        openCart={openCart}
        targetCart={targetCart}
        mutateCart={mutateCart}
      />
    </div>
  );
}
