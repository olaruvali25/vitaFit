"use client"

import React, { useState } from 'react';
import Image from "next/image";
import { FadeInView } from "@/components/ui/fade-in-view";

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Elena M. - Lost 10kg (22 lbs) / 3 months',
    imageUrl: '/images/transformation-before-1.png',   // BEFORE
    afterImageUrl: '/images/transformation-after-1.png', // AFTER
  },
  {
    id: 2,
    title: 'Darius P. - Lost 13kg (29 lbs) / 4 months',
    imageUrl: '/images/transformation-before-2.png',   // BEFORE,
    afterImageUrl: '/images/transformation-after-2.png', // AFTER',
  },
  {
    id: 3,
    title: 'Mateo R. - Gained 8kg (18 lbs) / 2 months',
    imageUrl: '/images/transformation-before-3.png',   // BEFORE',
    afterImageUrl: '/images/transformation-after-3.png', // AFTER',
  },
  {
    id: 4,
    title: 'Naomi L. - Gained 4kg (5 lbs), Lost 1kg fat / 1 month',
    imageUrl: '/images/transformation-before-4.png',   // BEFORE',',
    afterImageUrl: '/images/transformation-after-4.png', // AFTER',
  },
  {
    id: 5,
    title: 'Livia S. - Lost 11kg (24 lbs) / 2 months',
    imageUrl: '/images/transformation-before-5.png',   // BEFORE',',,
    afterImageUrl: '/images/transformation-after-5.png', // AFTER',',
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }: { item: any, isActive: boolean, onMouseEnter: () => void }) => {
  const hasBeforeAfter = !!item.afterImageUrl; // cards with afterImageUrl show before/after split

  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* IMAGINI */}
      {hasBeforeAfter ? (
        // Card special: Before / After (Sarah)
        <div className="absolute inset-0 flex w-full h-full">
          {/* BEFORE */}
          <div className="relative w-1/2 h-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={`${item.title} before`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 z-[1]"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1.5 rounded-full z-10 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold tracking-wider">BEFORE</span>
            </div>
          </div>

          {/* Middle Separator Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#18c260] to-transparent z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#18c260] rounded-full flex items-center justify-center shadow-lg shadow-[#18c260]/50 backdrop-blur-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* AFTER */}
          <div className="relative w-1/2 h-full overflow-hidden">
            <Image
              src={item.afterImageUrl}
              alt={`${item.title} after`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 z-[1]"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#18c260]/80 px-3 py-1.5 rounded-full z-10 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold tracking-wider">AFTER</span>
            </div>
          </div>
        </div>
      ) : (
        // Card normal (cele înguste din dreapta)
        <div className="absolute inset-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* TEXT (titlul pe verticală / orizontală) */}
      <span
        className={`
          absolute text-white text-sm font-semibold
          transition-all duration-300 ease-in-out z-20
          drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
          ${
            isActive
              ? 'bottom-4 left-1/2 -translate-x-1/2 rotate-0 max-w-[90%] text-center px-2 py-1'
              : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90 whitespace-nowrap'
          }
        `}
        style={{
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.7)',
        }}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main App Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="font-sans relative z-10">
      <section id="reviews" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-black scroll-mt-20">
        {/* Blending gradient layers for smooth transition */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Base gradient transitioning to match reviews section */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to bottom, 
                  rgba(15, 23, 42, 1) 0%,
                  rgba(15, 23, 42, 0.98) 30%,
                  rgba(0, 0, 0, 0.95) 70%,
                  rgba(0, 0, 0, 1) 100%
                )
              `
            }}
          />
          {/* Green gradient overlay - stronger at bottom to blend with reviews section */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to bottom,
                  transparent 0%,
                  rgba(24, 194, 96, 0.02) 50%,
                  rgba(24, 194, 96, 0.05) 80%,
                  rgba(24, 194, 96, 0.08) 100%
                ),
                linear-gradient(135deg,
                  rgba(24, 194, 96, 0.03) 0%,
                  rgba(34, 197, 94, 0.025) 50%,
                  rgba(24, 194, 96, 0.05) 100%
                )
              `
            }}
          />
          {/* Subtle nature tones - reduced opacity */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(24, 194, 96, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 55%)
              `
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <FadeInView delay={0.1} className="w-full md:w-1/2">
            <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">
              <span 
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                VitaFit
              </span>{' '}
              Success Stories<br />
              Real People, <span 
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                Real Results!
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto md:mx-0">
              The hardest part isn't starting.<br />
              It's believing you can.<br />
              These people did, and <span 
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(90deg, #18c260 0%, #1FCC5F 50%, #18c260 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                you can too!
              </span>
            </p>
            <div className="mt-8">
              <a
                href="/assessment"
                className="inline-block bg-[#18c260] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-[#1FCC5F] transition-colors duration-300"
              >
                Try For Yourself
              </a>
            </div>
            </div>
          </FadeInView>

          {/* Right Side: Image Accordion */}
          <FadeInView delay={0.2} className="w-full md:w-1/2">
            {/* Changed flex-col to flex-row to keep the layout consistent */}
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </FadeInView>
        </div>
        </div>
      </section>
    </div>
  );
}

