"use client"

import { FadeInView } from "@/components/ui/fade-in-view"
import { ReviewsTestimonials } from "@/components/reviews-testimonials"
import { CardCarousel } from "@/components/ui/card-carousel"
import { HeroGeometric } from "@/components/ui/hero-geometric"
import { BentoGridShowcase } from "@/components/ui/bento-grid-showcase"
import { AuthComponent } from "@/components/ui/auth-component"
import { Logo } from "@/components/logo"
import Image from "next/image"
import AppleActivityCard from "@/components/ui/apple-activity-card"

const whiteImageDataUri =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3C/svg%3E";

const carouselImages = [
  {
    id: 1,
    title: "Transformation 1",
    beforeImage: "/ReviewsPage/before1.png",
    afterImage: "/ReviewsPage/after1.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
  {
    id: 2,
    title: "Transformation 2",
    beforeImage: "/ReviewsPage/before2.png",
    afterImage: "/ReviewsPage/after2.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
  {
    id: 3,
    title: "Transformation 3",
    beforeImage: "/ReviewsPage/before3.png",
    afterImage: "/ReviewsPage/after3.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
  {
    id: 4,
    title: "Transformation 4",
    beforeImage: "/ReviewsPage/before4.png",
    afterImage: "/ReviewsPage/after4.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
  {
    id: 5,
    title: "Transformation 5",
    beforeImage: "/ReviewsPage/before5.png",
    afterImage: "/ReviewsPage/after5.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
  {
    id: 6,
    title: "Transformation 6",
    beforeImage: "/ReviewsPage/before6.png",
    afterImage: "/ReviewsPage/after6.png",
    profileImage: "",
    reviewerName: "",
    reviewText: "",
  },
];

export default function ReviewsPage() {
  return (
    <div className="relative w-full py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40">
      {/* Page-specific light green background overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 via-emerald-100/50 to-white/90" />
      <div className="w-full relative z-10">
        <FadeInView>
          <div className="text-center mb-12 px-4 md:px-8 lg:px-12">
            <h1 className="text-4xl font-bold mb-4 text-emerald-600">
              They Were Exactly Where You Are!
            </h1>
            <p className="text-lg text-gray-900 max-w-2xl mx-auto">
              The only difference? They finally had a plan that didn't fight their lifestyle, it
              worked with it.
            </p>
          </div>
        </FadeInView>

        <HeroGeometric 
          badge="VitaFit Success Stories"
          title1="Real People, Real Results"
          title2="Transformations That Inspire"
        />

        <ReviewsTestimonials />

        {/* Bento Grid Showcase */}
        <div className="mt-10 px-4 md:px-8 lg:px-12">
          <BentoGridShowcase
            integrations={
              <div className="h-full rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Smart Tools</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Small features that make staying healthy easier.</p>
                <AppleActivityCard title="Use Alongside Your Favourite Apps" className="p-0" />
              </div>
            }
            featureTags={
              <div className="h-full min-h-[120px] md:min-h-[150px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
                <Image
                  src="/ReviewsPage/reviews3.jpg"
                  alt="Features"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 drop-shadow-lg">Healthy Living, Simplified</h3>
                  <p className="text-xs md:text-sm text-white/90 mb-2 md:mb-4 drop-shadow-md">Eat better, move smarter, and enjoy the process, one day at a time.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 md:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/30">Nutrition</span>
                    <span className="px-2 md:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/30">Fitness</span>
                    <span className="px-2 md:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/30">Progress</span>
                  </div>
                </div>
              </div>
            }
            mainFeature={
              <div className="h-full min-h-[250px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
                <Image
                  src="/ReviewsPage/reviews1.jpg"
                  alt="Main Feature"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 drop-shadow-lg">Your Journey, Your Pace</h2>
                  <p className="text-sm md:text-base text-white/90 drop-shadow-md">Your personalized health journey starts here with VitaFit's comprehensive planning system.</p>
                </div>
              </div>
            }
            secondaryFeature={
              <div className="h-full min-h-[120px] md:min-h-[150px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative">
                <Image
                  src="/ReviewsPage/reviews2.jpg"
                  alt="Additional Insights"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 drop-shadow-lg">Momentum Matters</h3>
                  <p className="text-xs md:text-sm text-white/90 drop-shadow-md">Track progress, stay consistent, and keep moving forward.</p>
                </div>
              </div>
            }
            statistic={
              <div className="h-full rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-center items-center text-center">
                <div className="text-3xl md:text-5xl font-bold text-white mb-1 md:mb-2">96%</div>
                <p className="text-emerald-50 text-base md:text-lg font-medium">Success Rate</p>
                <p className="text-emerald-100 text-xs md:text-sm mt-1 md:mt-2">People who stay consistent with VitaFit reach their goals.</p>
              </div>
            }
            journey={
              <div className="h-full rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-200/50 p-4 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Journey</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Start your plan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Track progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Achieve goals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Adjust automatically to your schedule</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Stay consistent with daily guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Celebrate wins, big or small</span>
                  </div>
                </div>
              </div>
            }
          />
        </div>

        {/* Card carousel proof section */}
        <div className="mt-10 px-4 md:px-8 lg:px-12">
          <CardCarousel images={carouselImages} />
        </div>

        {/* Auth Component */}
        <div className="mt-10">
          <AuthComponent brandName="VitaFit" logo={<Logo className="h-20 md:h-28 lg:h-32" />} />
        </div>
      </div>
    </div>
  )
}

