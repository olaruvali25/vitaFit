"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    title: "Best decision",
    body:
      "Our goal was to stop guessing what to eat every day. VitaFit gave us clear weeks we can actually follow.",
    name: "Member name",
    initials: "MN",
  },
  {
    title: "Finally consistent",
    body:
      "I used to swing between perfect weeks and chaos. Now my meals just match my schedule, even when it changes.",
    name: "Member name",
    initials: "MC",
  },
  {
    title: "Works with real life",
    body:
      "Kids, late meetings, travel… I thought a plan couldn’t fit all that. VitaFit adjusts automatically for me.",
    name: "Member name",
    initials: "RL",
  },
  {
    title: "No more starting over Monday",
    body:
      "Takeout night doesn’t ruin everything anymore. The app just recalculates the rest of the week so I can move on.",
    name: "Member name",
    initials: "SM",
  },
  {
    title: "Clear, simple structure",
    body:
      "I open the app and my day is laid out. No spreadsheets, no macros in my head, just meals that make sense.",
    name: "Member name",
    initials: "CS",
  },
  {
    title: "Travel friendly",
    body:
      "I‘m on the road a lot. Being able to plug trips into VitaFit and still stay on track has been huge for me.",
    name: "Member name",
    initials: "TF",
  },
  {
    title: "Built my confidence back",
    body:
      "Seeing steady progress instead of big swings made me actually trust myself again around food.",
    name: "Member name",
    initials: "BC",
  },
  {
    title: "Less mental load",
    body:
      "I used to spend hours planning and second-guessing. Now the thinking is done for me and I just follow the plan.",
    name: "Member name",
    initials: "LM",
  },
  {
    title: "Family approved",
    body:
      "I‘m not cooking separate meals anymore. The plan works for my goals and still feels normal for everyone else.",
    name: "Member name",
    initials: "FA",
  },
  {
    title: "Sustainable for once",
    body:
      "This is the first time a plan hasn’t felt like a temporary “diet”. It just feels like my life, but clearer.",
    name: "Member name",
    initials: "SU",
  },
];

export function ReviewsTestimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const id = setTimeout(() => {
      const currentIndex = api.selectedScrollSnap();
      const lastIndex = api.scrollSnapList().length - 1;

      if (currentIndex >= lastIndex) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent((prev) => prev + 1);
      }
    }, 4000);

    return () => clearTimeout(id);
  }, [api, current]);

  const totalReviews = reviews.length;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8">
          <h2 className="text-left text-2xl font-semibold tracking-tight text-white md:text-3xl lg:text-4xl">
            Trusted by thousands of{" "}
            <span className="text-emerald-300">VitaFit members</span> worldwide
          </h2>

          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {reviews.map((review, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="flex h-full flex-col justify-between gap-6 rounded-md bg-white/5/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.65)]">
                    <User className="h-8 w-8 stroke-1 text-emerald-300" />

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl font-semibold tracking-tight text-white">
                          {review.title}
                        </h3>
                        <p className="max-w-xs text-base text-emerald-50/85">
                          {review.body}
                        </p>
                      </div>

                      <p className="flex flex-row items-center gap-2 text-sm text-emerald-50/80">
                        <span className="text-emerald-200/80">By</span>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Member avatar" />
                          <AvatarFallback>{review.initials}</AvatarFallback>
                        </Avatar>
                        <span>{review.name}</span>
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                if (!api) return;
                const snaps = api.scrollSnapList();
                if (!snaps.length) return;
                const currentIndex = api.selectedScrollSnap();
                const lastIndex = snaps.length - 1;
                const prevIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
                api.scrollTo(prevIndex);
                setCurrent(prevIndex);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-emerald-100 hover:bg-black/70"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (!api) return;
                const snaps = api.scrollSnapList();
                if (!snaps.length) return;
                const currentIndex = api.selectedScrollSnap();
                const lastIndex = snaps.length - 1;
                const nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
                api.scrollTo(nextIndex);
                setCurrent(nextIndex);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-emerald-100 hover:bg-black/70"
              aria-label="Next review"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


