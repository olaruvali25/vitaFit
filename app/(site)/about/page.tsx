"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { FadeInView } from "@/components/ui/fade-in-view"
import { CheckCircle2, Heart, Target, Users, ChevronRight } from "lucide-react"
import { CtaCard } from "@/components/ui/cta-card"
import { GradientCard } from "@/components/ui/gradient-card"
import Image from "next/image"
import SectionWithMockup from "@/components/SectionWithMockup"


export default function AboutPage() {
  return (
    <div className="relative w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/40">
      {/* Page-specific light background with green/teal gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 via-emerald-100/50 to-white/90" />
      {/* Green shadows at corners */}
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/8 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-teal-700/8 rounded-full blur-3xl -z-10" />
      <div className="w-full space-y-12 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* 1️⃣ Hero (top of About page) */}
        <motion.section 
          className="text-center space-y-3 pt-16 md:pt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            About VitaFit
          </motion.div>

          <motion.h1 
            className="text-balance text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Built for <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">real people</span> with{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              real lives.
            </span>
          </motion.h1>

          <motion.p 
            className="text-base md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-8 md:px-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-emerald-600">You're not failing. You've simply never had a plan designed for your lifestyle.</span>
          </motion.p>
        </motion.section>

        <SectionWithMockup
          title={
            <>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 block mb-1 md:mb-2">
                Why we&apos;re here
              </span>
              <span>
                <span className="text-emerald-300">VitaFit</span> was created for people who want to feel healthier, stronger, and more confident!
              </span>
            </>
          }
          description="No overwhelm. No guesswork. No unrealistic expectations. Just steady, sustainable progress. The kind that finally feels doable. On busy weeks. On slow weeks. On every kind of week."
          primaryImageSrc="/AboutPage/aboutpage2.jpg"
          secondaryImageSrc="/AboutPage/aboutpage3.jpg"
        />

        <FadeInView>
          <section className="mt-4 space-y-12 md:space-y-16 w-full px-4 md:px-8 lg:px-12 -mt-8">
            {/* Stats strip - uses numbers inspired by the contact section */}
            <motion.div 
              className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 backdrop-blur-xl border border-emerald-200/50 px-3 py-3 md:px-15 md:py-15 -mt-20 w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid gap-6 text-center md:grid-cols-3">
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-gray-900">10.000+</div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Personalized meals generated with <span className="text-emerald-300">VitaFit</span>
                  </p>
                </motion.div>
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-gray-900">96%</div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Users who stick to their plan once it matches their real life
                  </p>
                </motion.div>
                <motion.div 
                  className="space-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-2xl md:text-3xl font-semibold text-gray-900">&lt; 2h</div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Average response time when you reach out for help
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </FadeInView>

        {/* 3️⃣ New About layout (as provided) */}
        <section className="py-8 md:py-12 bg-transparent w-full">
          <div className="w-full space-y-6 px-4 md:px-8 lg:px-12">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center -mt-12 md:-mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              The <span className="text-emerald-300">VitaFit</span> Ecosystem
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                className="rounded-xl object-cover w-full h-[140px] md:h-[260px]"
                src="/AboutPage/aboutpage1.png"
                alt="Hero section image"
                width={2400}
                height={1200}
                priority
              />
            </motion.div>

            <div className="mt-16 w-full px-4 md:px-8 lg:px-12">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-normal tracking-normal mb-6 text-center">
                For us, personalization is key. The more we know about you, the better the plan will be!
              </h1>
              <div className="space-y-4 flex flex-col items-center">
                <p className="text-base md:text-lg text-gray-700 leading-normal tracking-normal text-center max-w-4xl w-full px-4">
                  Whether you're juggling work, family, a packed schedule, or you've restarted your fitness journey more times than you can count, <span className="text-emerald-300">VitaFit</span> adapts to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Feature Section */}
        <FadeInView delay={0.1}>
          <section className="py-16 md:py-20 -mt-8 w-full">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="flex flex-col items-center gap-6 w-full">
                <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl text-gray-900">
                When you finally understand what your body needs, everything becomes easier.
                </h2>
                <p className="text-emerald-600 lg:text-lg">Replace overwhelm with confidence!</p>
                <div className="mt-6 flex flex-col gap-6 lg:flex-row w-full">
                  <div className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl text-gray-900 flex flex-col items-center justify-center gap-5 lg:w-1/3 p-8">
                    <div className="p-6 text-lg lg:text-2xl text-gray-700 text-center leading-tight tracking-tight">
                    The stress drops. The guilt disappears. The chaos in your head quiets down. That's what <span className="text-emerald-300">VitaFit</span> is designed to give you: clarity!
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <Image
                      src="/AboutPage/aboutpage10.png"
                      alt=""
                      width={800}
                      height={600}
                      className="h-full max-h-96 w-full rounded-md object-cover"
                    />
                  </div>
                  <div className="rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl text-gray-900 flex flex-col items-center justify-center gap-5 lg:w-1/3 p-8">
                    <div className="p-6 text-lg lg:text-2xl text-gray-700 text-center leading-tight tracking-tight">
                    From feeling guided instead of judged. That's the experience <span className="text-emerald-300">VitaFit</span> wants you to have every time you open the app!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInView>

        {/* Animated Feature Cards - Our mission is simple (moved above About section) */}
        <FadeInView delay={0.15}>
          <section className="mt-16 py-12 md:py-16 w-full px-4 md:px-8 lg:px-12">
            <div className="rounded-3xl bg-gradient-to-br from-teal-50/60 via-emerald-50/40 to-white/80 backdrop-blur-sm px-4 md:px-8 lg:px-12 py-12 md:py-16 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Our mission is simple.
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 w-full">
              <GradientCard
                gradient="orange"
                badgeText="Nutrition"
                badgeColor="#14B8A6"
                title="Tell us how you really live."
                description="To fit health into your life, not force your life around a diet. Share your work schedule, sleep, training days, and the foods you actually enjoy"
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
              <GradientCard
                gradient="purple"
                badgeText="Fitness"
                badgeColor="#14B8A6"
                title="Get a weekly plan that fits."
                description={
                  <>
                    To make getting in shape feel clear, not confusing. <span className="text-emerald-300">VitaFit</span> builds your meals around your time, your calories, and your preferences. Each day has a clear structure, so you always know what to eat!
                  </>
                }
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
              <GradientCard
                gradient="green"
                badgeText="Progress"
                badgeColor="#14B8A6"
                title="Adjust as life happens."
                description={
                  <>
                    To help you build habits you're proud of and results you can actually see. Busy week? Extra dinner out? Progress speeding up or slowing down? Update a few details and <span className="text-emerald-300">VitaFit</span> recalculates macros, meals, and training so your plan always matches your reality.
                  </>
                }
                ctaText="Learn more"
                ctaHref="#"
                imageUrl=""
              />
              </div>
            </div>
          </section>
        </FadeInView>

        {/* ---------------- ABOUT SECTION (provided layout) ---------------- */}
        <section className="py-20 md:py-28">
          <div className="w-full space-y-16 px-4 md:px-8 lg:px-12">
            {/* Header */}
            <div className="flex flex-col items-center gap-6 w-full">
              <p className="text-gray-700 text-lg md:text-xl leading-normal tracking-normal text-center max-w-4xl">
              No two people live the same life, and your plan shouldn't pretend you do. <span className="text-emerald-300">VitaFit</span> uses your schedule, your preferences and even your limitations to create a plan that feels familiar!
              </p>
            </div>

            {/* ---------------- LAST THREE CARDS (NEW LAYOUT) ---------------- */}
            <div className="flex flex-col md:flex-row gap-6 mt-16">
              {/* LEFT BIG IMAGE */}
              <motion.div 
                className="md:flex-1 relative overflow-hidden rounded-xl"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03 }}
              >
                <Image
                  src="/AboutPage/aboutpage9.jpg"
                  alt="Left big image"
                  width={1200}
                  height={800}
                  className="rounded-xl object-cover w-full h-[300px] sm:h-[360px] md:h-[100%]"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
                  <h3 className="text-xl font-bold text-gray-900">Build Momentum That Lasts</h3>
                  <p className="mt-2 text-sm text-gray-600">
                  Small, sustainable choices that compound into real progress.
                   <span className="text-emerald-300">VitaFit</span> helps you stay consistent without burnout or confusion.
                  </p>
                </div>
              </motion.div>

              {/* RIGHT TWO CARDS */}
              <div className="flex flex-col gap-6 md:flex-1">
                {/* FIRST CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden rounded-xl bg-white border border-gray-200 text-gray-900 shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-60 sm:h-64 md:h-48 w-full overflow-hidden"
                  >
                    <Image
                      src="/AboutPage/aboutpage3.jpg"
                      alt="Card Image"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-black via-black/70 to-transparent" />
                  </motion.div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">Better Choices, Every Day</h3>
                    <p className="mt-2 text-sm text-gray-600">
                    Nutrition built around your lifestyle so you can stop restarting and start progressing.
                    </p>
                    <Button
                      asChild
                      className="mt-4 bg-teal-500 text-white hover:bg-teal-600 border-teal-500"
                    >
                      <Link href="/reviews">
                        See some results
                      </Link>
                    </Button>
                  </div>
                </motion.div>

                {/* SECOND CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03 }}
                  className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-lg"
                >
                  <Image
                    src="/AboutPage/aboutpage4.jpg"
                    alt="Secondary card"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover min-h-[220px] sm:min-h-[240px] md:min-h-[220px]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/95 to-transparent">
                    <h3 className="text-xl font-bold text-gray-900">Real Plans for Real Lives</h3>
                    <p className="mt-2 text-sm text-gray-700">
                    Flexible, personalized guidance that makes staying on track actually doable.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Short story (founder-style, brand-neutral) */}
        <FadeInView delay={0.1}>
          <section>
            <Card className="border border-emerald-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-emerald-100 p-2">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl text-gray-900">Why <span className="text-emerald-300">VitaFit</span> was built</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    Not another fitness app yelling macros at you. A system that starts with your actual life.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
                <p>
                  Most fitness apps throw numbers, charts, and generic plans at you.
                  <br />
                  "Eat 1,600 calories." "Train 5x per week." "Hit 10k steps."
                </p>
                <p>
                  But they don&apos;t ask the most important questions:
                </p>
                <ul className="space-y-1.5 pl-4 text-gray-700 list-disc">
                  <li>What does your actual day look like?</li>
                  <li>How much time do you really have?</li>
                  <li>What food do you genuinely enjoy — and what do you hate?</li>
                </ul>
                <p>
                  <span className="text-emerald-300">VitaFit</span> was built to fix that.
                  <br />
                  Not by shouting louder… but by listening better.
                </p>
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 3️⃣ Mission section */}
        <FadeInView delay={0.2}>
          <section>
            <Card className="border border-emerald-200/60 bg-gradient-to-br from-emerald-100/70 via-teal-100/50 to-emerald-50/80 shadow-sm">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-1 mb-3">
                  <Target className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                    Our mission is simple
                  </span>
                </div>
                <CardTitle className="text-2xl text-gray-900">Our mission is simple:</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 space-y-3">
                {[
                  "To make getting in shape feel clear, not confusing.",
                  "To fit health into your life, not force your life around a diet.",
                  "To remove the shame and \"start over Monday\" cycle.",
                  "To help you build habits you're proud of — and results you can actually see.",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                    <p className="text-sm md:text-base text-gray-700">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 4️⃣ CTA Card with VitaFit message */}
        <FadeInView delay={0.3} duration={0.7} y={24}>
          <section className="flex justify-center items-center w-full px-2">
            <CtaCard
              imageSrc=""
              title={
                <>
                  <span className="text-emerald-300">VitaFit</span> is ready when you are!
                </>
              }
              description="We understand your schedule, your cravings, your lifestyle and your goals! A plan built just for you!"
              inputPlaceholder="Email address"
              buttonText="FREE PLAN" 
              className="mt-8 max-w-6xl w-full"
            />
          </section>
        </FadeInView>

        {/* 5️⃣ Who it’s for */}
        <FadeInView delay={0.4}>
          <section>
            <Card className="border border-emerald-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-gray-900">
                  <span className="text-emerald-300">VitaFit</span> is for you if…
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
                {[
                  "You've tried strict diets and always bounced back.",
                  "You're busy, and you need clarity, not 100 more \"tips\".",
                  "You want guidance without paying hundreds for a coach every month.",
                  "You're ready to stop guessing — and finally follow a plan built for your life.",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </FadeInView>

        {/* 6️⃣ Final emotional closer + CTA */}
        <FadeInView delay={0.5}>
          <section>
            <Card className="relative overflow-hidden border border-gray-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 shadow-sm">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
              <CardHeader className="space-y-4 text-center relative z-10">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-1">
                  <Users className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
                    Why we care
                  </span>
                </div>
                <CardTitle className="text-xl md:text-2xl text-gray-900">
                  Your life doesn't have to revolve around fitness.
                </CardTitle>
                <CardDescription className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto">
                  But your fitness can quietly support the life you want.
                  <br />
                  That's what <span className="text-emerald-300">VitaFit</span> is here for.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8 text-center relative z-10">
                <Button
                  size="lg"
                  asChild
                  className="px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-shadow"
                >
                  <Link href="/assessment">Take the Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </FadeInView>
      </div>
    </div>
  )
}

