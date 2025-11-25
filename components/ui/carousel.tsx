"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CarouselApi {
  selectedScrollSnap(): number;
  scrollSnapList(): number[];
  scrollTo(index: number): void;
  scrollNext(): void;
}

interface CarouselContextValue {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  setLength: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) {
    throw new Error("Carousel components must be used within <Carousel>");
  }
  return ctx;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  setApi?: (api: CarouselApi) => void;
}

export function Carousel({ className, setApi, children, ...props }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [length, setLength] = React.useState(0);

  React.useEffect(() => {
    if (!setApi || length === 0) return;

    const api: CarouselApi = {
      selectedScrollSnap: () => currentIndex,
      scrollSnapList: () => Array.from({ length }, (_, i) => i),
      scrollTo: (index: number) => {
        setCurrentIndex((prev) => {
          if (length === 0) return prev;
          const clamped = Math.max(0, Math.min(length - 1, index));
          return clamped;
        });
      },
      scrollNext: () => {
        setCurrentIndex((prev) => {
          if (prev + 1 < length) return prev + 1;
          return prev;
        });
      },
    };

    setApi(api);
  }, [setApi, currentIndex, length]);

  return (
    <CarouselContext.Provider
      value={{ currentIndex, setCurrentIndex, length, setLength }}
    >
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CarouselContent({ className, children, ...props }: CarouselContentProps) {
  const { currentIndex, setLength } = useCarousel();
  const items = React.Children.toArray(children);

  React.useEffect(() => {
    setLength(items.length);
  }, [items.length, setLength]);

  return (
    <div className={cn("relative w-full", className)} {...props}>
      {items.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-opacity duration-500",
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CarouselItem({ className, ...props }: CarouselItemProps) {
  return <div className={cn("w-full", className)} {...props} />;
}


