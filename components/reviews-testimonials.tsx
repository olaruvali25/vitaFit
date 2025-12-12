"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "As a busy mom of two, I always ate whatever I could grab. VitaFit didn't just give me a plan — it gave me structure. I finally feel in control instead of overwhelmed.",
    by: "Maya · Lost 2.3 kg in 1 Month",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 1,
    testimonial: "I've been skinny my whole life. I tried eating more, but nothing worked. VitaFit gave me a structured plan that helped me add meals that actually build muscle, not just calories. For the first time, I'm filling out my shirts.",
    by: "Leo · Gained 4.2 kg of Muscle",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 2,
    testimonial: "I thought focusing on myself meant taking time away from my kids. VitaFit proved the opposite — I have more energy and they see a stronger, happier version of me.",
    by: "Elena · Stronger & More Energetic",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 3,
    testimonial: "I didn't want to be skinny. I wanted to be fit. VitaFit combined the meals and workouts so well that I finally see real definition in my arms and shoulders.",
    by: "Amir · Gained Visible Muscle in 6 Weeks",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 4,
    testimonial: "I've quit every program I started. But VitaFit fits my life so well, I don't feel like I'm 'on a diet.' I just eat better and move more — it stuck.",
    by: "Jasmine · Finally Consistent After Years",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 5,
    testimonial: "My kid joked about my belly one day and it stung. VitaFit helped me lose fat AND build strength without living at the gym. I feel proud of myself again.",
    by: "Mark · Down 5 kg, Up Strength",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 6,
    testimonial: "I never had perfect weeks. I needed something flexible. VitaFit adjusts when I work late, when I travel, when life changes. It's the first plan that moves with me.",
    by: "Priya · Balanced & Confident",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 7,
    testimonial: "People don't talk about how hard it is to GAIN weight. I needed a plan that pushed me without overwhelming me. VitaFit gave me meals I could actually follow.",
    by: "Noah · Gained 3.5 kg Lean Mass",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 8,
    testimonial: "Sitting all day made me feel stuck. VitaFit gave me meals that keep me energized and simple workouts I can do even after long days.",
    by: "Alex · Down 4.5 kg, Office Worker",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 9,
    testimonial: "I needed something fast, realistic, and affordable. VitaFit tells me exactly what to cook and how to train. I finally feel like I'm doing something for ME.",
    by: "Brianna · Lost 3.2 kg & Gained Energy",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 10,
    testimonial: "VitaFit helped me eat enough protein and calories to actually grow muscle. I'm not just 'not skinny' anymore — I look strong.",
    by: "Viktor · Gained 5.1 kg, Looks Athletic",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 11,
    testimonial: "Before VitaFit, every week felt like a fresh start. Now I just follow the plan. No more guilt, no more shame — only progress.",
    by: "Serena · Lost 2.9 kg & Regained Control",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 12,
    testimonial: "I used to be scared of calories because I thought I'd get fat. VitaFit taught me how to eat MORE to build muscle. I feel stronger every week.",
    by: "Jonah · Gained 3 kg Muscle Mass",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 13,
    testimonial: "I'm on the road constantly. VitaFit gives me eating options for airports and hotels. I don't lose momentum anymore.",
    by: "Jason · Down 5.2 kg, Frequent Traveler",
    imgSrc: "https://github.com/shadcn.png"
  },
  {
    tempId: 14,
    testimonial: "Nothing ever worked because nothing was made for me. VitaFit built a plan based on my body, my schedule, and my goal — which was gaining weight, not losing it. It finally feels personal.",
    by: "Sofia · Gained Strength & Confidence",
    imgSrc: "https://github.com/shadcn.png"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out rounded-xl",
        isCenter 
          ? "z-10 bg-emerald-100 text-gray-900 border-emerald-300" 
          : "z-0 bg-white text-gray-900 border-gray-200 hover:border-emerald-400/50 shadow-lg"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(16, 185, 129, 0.15)" : "0px 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-gray-200"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-gray-900" : "text-gray-900"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-gray-700" : "text-gray-600"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-lg shadow-lg"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-lg shadow-lg"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export function ReviewsTestimonials() {
  return (
    <section className="py-16 md:py-24 w-full">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 w-full">
          <h2 className="text-left text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
            Trusted by thousands of{" "}
            <span className="text-emerald-600">VitaFit members</span> worldwide
          </h2>

          <StaggerTestimonials />
        </div>
      </div>
    </section>
  );
}
