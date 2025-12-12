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
    <section className="w-full bg-gradient-to-br from-emerald-50/60 via-teal-50/50 to-emerald-100/30 rounded-3xl">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-5xl rounded-[24px] p-3 md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] p-2 md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          <Badge
            variant="outline"
            className="absolute left-4 top-6 rounded-[14px] border border-emerald-300/50 text-base md:left-6 bg-white/5 backdrop-blur-sm"
          >
            <SparklesIcon className="fill-emerald-400 stroke-1 text-gray-900" />{" "}
            <span className="text-gray-900">Here is some proof too!</span>
          </Badge>
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl opacity-85 font-bold tracking-tight text-gray-900">
                Proof That Change Is Possible!
                </h3>
                <p className="text-gray-700">People following the same system you’re about to start.</p>
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


