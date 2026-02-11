'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react";


interface CarouselContainerProps {
  children: React.ReactNode[];
  slideToShow: number;
  variant?: boolean;
}

export default function CarouselContainer({ children, slideToShow, variant }: CarouselContainerProps) {
  const [slides, setSlides] = useState(slideToShow);

  useEffect(() => {
    const handleResize = () => {
      if (variant) {
        if (window.innerWidth <= 520) {
          setSlides(3);
        }
        else if (window.innerWidth <= 768) {
          setSlides(5);
        } else if (window.innerWidth <= 1200) {
          setSlides(10);
        } else {
          setSlides(slideToShow);
        }
      } else {
        if (window.innerWidth <= 1200) {
          setSlides(2);
        } else {
          setSlides(slideToShow);
        }
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [variant]);


  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem key={index}
            style={{ flexBasis: `${100 / slides}%` }}
          >
            <div className="p-1">
              {child}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

