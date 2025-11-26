"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { SparklesIcon } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransformationCard {
  id: number;
  title: string;
  beforeImage: string;
  afterImage: string;
  profileImage?: string;
  reviewerName: string;
  reviewText: string;
}

interface CarouselProps {
  images: TransformationCard[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 60px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 380px;
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  `;

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-ace-y-4">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-5xl rounded-[24px] border border-black/5 p-3 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Here is some proof too!
          </Badge>
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl opacity-85 font-bold tracking-tight">
                  Here is some proof too!
                </h3>
                <p>They trusted VitaFit, You should too!</p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full max-w-3xl">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                onSlideChange={(swiper) =>
                  setActiveIndex(
                    (swiper as any).realIndex ?? swiper.activeIndex ?? 0
                  )
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {images.map((card, index) => {
                  const isActive = index === activeIndex;
                  const beforeSrc = card.beforeImage || card.afterImage;
                  const afterSrc = card.afterImage || card.beforeImage;

                  return (
                    <SwiperSlide key={card.id ?? index}>
                      <div className="relative h-[520px] w-full overflow-hidden rounded-[32px] bg-black/40">
                        <div className="flex h-full w-full">
                          {/* BEFORE */}
                          <div className="relative h-full w-1/2 overflow-hidden">
                            <Image
                              src={beforeSrc}
                              width={500}
                              height={500}
                              className="h-full w-full object-cover"
                              alt={card.title}
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                              Before
                            </div>
                          </div>
                          {/* AFTER */}
                          <div className="relative h-full w-1/2 overflow-hidden">
                            <Image
                              src={afterSrc}
                              width={500}
                              height={500}
                              className="h-full w-full object-cover"
                              alt={card.title}
                            />
                            <div className="absolute inset-0 bg-emerald-500/10" />
                            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                              After
                            </div>
                          </div>
                        </div>

                        {/* Glassmorphism review overlay */}
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/20 px-4 py-3 text-left backdrop-blur-md transition-all duration-300",
                            isActive
                              ? "opacity-100 scale-100"
                              : "opacity-70 scale-95"
                          )}
                        >
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/40 bg-black/50">
                            {card.profileImage ? (
                              <Image
                                src={card.profileImage}
                                alt={card.reviewerName}
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-emerald-100">
                                {card.reviewerName?.charAt(0) ?? "V"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-white">
                              {card.reviewerName}
                            </p>
                            <p className="text-[11px] text-emerald-50/90 line-clamp-2">
                              {card.reviewText}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


