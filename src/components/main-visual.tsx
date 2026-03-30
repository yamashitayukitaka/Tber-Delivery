"use client";

import Image from "next/image";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// const SKILLS = [
//   { src: "react.png", alt: "React", w: "w-[40px]" },
//   { src: "next-js.svg", alt: "Next.js", w: "w-[20px]" },
//   { src: "typescript.svg", alt: "TypeScript", w: "w-[20px]" },
//   { src: "tailwind.svg", alt: "Tailwind CSS", w: "w-[60px]" },
//   { src: "supabase.png", alt: "Supabase", w: "w-[95px]" },
//   { src: "stripe.svg", alt: "Stripe", w: "w-[50px]" },
//   { src: "map.png", alt: "Maps", w: "w-[20px]" },
//   { src: "google.png", alt: "Google", w: "w-[20px]" },
//   { src: "swr.svg", alt: "SWR", w: "w-[60px]" },
//   { src: "zod.png", alt: "Zod", w: "w-[20px]" },
//   { src: "shadcnui.svg", alt: "shadcn/ui", w: "w-[20px]" },
//   { src: "lucide.svg", alt: "Lucide", w: "w-[20px]" },
//   { src: "vercel-text.svg", alt: "Vercel", w: "w-[40px]" },
//   { src: "github.svg", alt: "GitHub", w: "w-[20px]" },
// ];

// ループを安定させるために2倍にする
// const DISPLAY_SKILLS = [...SKILLS, ...SKILLS, ...SKILLS];

export default function MainVisual() {
  return (
    <div className="h-60 overflow-hidden relative">
      {/* 動きを一定速度にするためのインラインスタイル */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      ` }} />

      <Image
        className="object-cover"
        src="/images/header/img01.jpg"
        alt="メインビジュアル"
        fill
        priority
        sizes="(max-width:1280px) 100vw, 1920px"
      />
      <div className="absolute top-[50%] left-[50%] transform -translate-y-1/2 -translate-x-1/2 z-20 w-full">
        <h2 className="w-fit m-auto text-white font-bold text-[24px] text-center bg-black/50 px-3 py-3 max-lg:w-[80%] max-md:text-[20px]  shadow-lg">
          位置情報から<br className="hidden max-sm:block" />飲食店を検索し<br />
          注文・決済まで行える<br className="hidden max-sm:block" />フードデリバリーアプリ
        </h2>

        {/* <div className="max-w-[1200px] mx-auto">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            speed={3000} // 数値を大きくするほどゆっくり流れます
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            slidesPerView='auto'
            spaceBetween={75}
            allowTouchMove={false} // 手動操作を禁止するとループが安定します
            freeMode={true}
          >
            {DISPLAY_SKILLS.map((skill, index) => (
              <SwiperSlide
                key={`${skill.src}-${index}`}
                className="flex! items-center justify-center w-auto! h-[initial]!"
              >
                <div className={`${skill.w} bg-white px-5`}>
                  <img
                    src={`/images/skills/${skill.src}`}
                    alt={skill.alt}
                    className="w-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div> */}
      </div>
    </div>
  );
}