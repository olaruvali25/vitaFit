"use client"

import { FadeInView } from "@/components/ui/fade-in-view"
import { ReviewsTestimonials } from "@/components/reviews-testimonials"
import { CardCarousel } from "@/components/ui/card-carousel"

const whiteImageDataUri =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E%3C/svg%3E";

const carouselImages = [
  {
    id: 1,
    title: "Sarah – Lost 25 lbs",
    beforeImage: "/images/transformation-before-1.png",
    afterImage: "/images/transformation-after-1.png",
    profileImage: "/images/profile-sarah.png",
    reviewerName: "Sarah M.",
    reviewText: "Didn't expect VitaFit to work this well.",
  },
  {
    id: 2,
    title: "Darius – Lost 28 lbs",
    beforeImage: "/images/transformation-before-2.png",
    afterImage: "/images/transformation-after-2.png",
    profileImage: "/images/profile-darius.png",
    reviewerName: "Darius P.",
    reviewText: "My meals finally match my schedule, not the other way around.",
  },
  {
    id: 3,
    title: "Mateo – Gained 18 lbs of muscle",
    beforeImage: "/images/transformation-before-3.png",
    afterImage: "/images/transformation-after-3.png",
    profileImage: "/images/profile-mateo.png",
    reviewerName: "Mateo R.",
    reviewText: "Clear structure around training days changed everything.",
  },
  {
    id: 4,
    title: "Naomi – Recomp in 4 weeks",
    beforeImage: "/images/transformation-before-4.png",
    afterImage: "/images/transformation-after-4.png",
    profileImage: "/images/profile-naomi.png",
    reviewerName: "Naomi L.",
    reviewText: "I stopped “starting over Monday” and just kept going.",
  },
  {
    id: 5,
    title: "Livia – Lost 24 lbs",
    beforeImage: "/images/transformation-before-5.png",
    afterImage: "/images/transformation-after-5.png",
    profileImage: "/images/profile-livia.png",
    reviewerName: "Livia S.",
    reviewText: "VitaFit fits my family, my job, and my cravings.",
  },
  {
    id: 6,
    title: "You – Next transformation",
    beforeImage: whiteImageDataUri,
    afterImage: whiteImageDataUri,
    profileImage: "",
    reviewerName: "Your name",
    reviewText: "Your story gets written next.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="relative px-4 py-16 md:py-24">
      {/* Page-specific green-tinted background to match About page */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/70 via-emerald-900/50 to-transparent" />
      <div className="container mx-auto max-w-6xl">
        <FadeInView>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-emerald-300">
              They Were Exactly Where You Are!
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              The only difference? They finally had a plan that didn’t fight their lifestyle, it
              worked with it.
            </p>
          </div>
        </FadeInView>

        <ReviewsTestimonials />

        {/* Card carousel proof section */}
        <div className="mt-10">
          <CardCarousel images={carouselImages} />
        </div>
      </div>
    </div>
  )
}

