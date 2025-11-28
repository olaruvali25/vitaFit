"use client";

import * as React from "react";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type TabMedia = {
  value: string; // unique value for Tabs
  label: string; // button label
  src: string;   // image url
  alt?: string;
};

export type ShowcaseStep = {
  id: string;
  title: string;
  text: string;
};

export type FeatureShowcaseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** small chips under the description */
  stats?: string[];
  /** accordion steps on the left */
  steps?: ShowcaseStep[];
  /** right-side tabs (image per tab) */
  tabs: TabMedia[];
  /** which tab is active initially */
  defaultTab?: string;
  /** fixed panel height in px (also applied as min-height) */
  panelMinHeight?: number;
  className?: string;
};

function highlightYourWord(text: string) {
  const parts = text.split(/(Your|your)/g);

  return parts.map((part, index) => {
    if (part === "Your" || part === "your") {
      return (
        <span
          key={index}
          className="bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-400 bg-clip-text text-transparent"
        >
          {part}
        </span>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function FeatureShowcase({
  eyebrow = "Discover",
  title,
  description,
  stats = ["1 reference", "30s setup", "Share‑ready"],
  steps = [
    {
      id: "step-1",
      title: "Drop a reference",
      text:
        "Upload a single image. We read it like a brief and extract palette, texture and cues.",
    },
    {
      id: "step-2",
      title: "Pick the vibe",
      text:
        "Switch between mockup, screen, or abstract views and tune the mood instantly.",
    },
    {
      id: "step-3",
      title: "Export & share",
      text:
        "Get a moodboard ready for your team with consistent visuals and notes.",
    },
  ],
  tabs,
  defaultTab,
  panelMinHeight = 720,
  className,
}: FeatureShowcaseProps) {
  const initial = defaultTab ?? (tabs[0]?.value ?? "tab-0");

  return (
    <section className={cn("w-full bg-background text-foreground", className)}>
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-12 lg:gap-14">
        {/* Left column */}
        <div className="md:col-span-6">
          <Badge variant="outline" className="mb-4">
            {eyebrow}
          </Badge>

          <h2 className="text-balance text-3xl font-bold leading-[1.05] sm:text-4xl md:text-5xl text-white">
            {highlightYourWord(title)}
          </h2>

          {/* Custom description with highlighted keywords for VitaFit usage */}
          {description ? (
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/80 leading-relaxed">
              See how VitaFit turns your{" "}
              <span className="text-emerald-300 font-semibold">goals</span>,{" "}
              <span className="text-emerald-300 font-semibold">schedule</span>, and{" "}
              <span className="text-emerald-300 font-semibold">food preferences</span>{" "}
              into a clear weekly structure you can actually follow, without{" "}
              <span className="text-emerald-300 font-semibold">starving</span>,{" "}
              <span className="text-emerald-300 font-semibold">guessing</span>, or{" "}
              <span className="text-emerald-300 font-semibold">rebuilding your life around a diet</span>.
            </p>
          ) : null}

          {/* Stats chips */}
          {stats.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {stats.map((s, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-muted text-foreground"
                >
                  {s}
                </Badge>
              ))}
            </div>
          )}

        </div>

        {/* Right column */}
        <div className="md:col-span-6">
          <Card
            className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-0 shadow-sm"
            style={{ height: panelMinHeight, minHeight: panelMinHeight }}
          >
            <Tabs defaultValue={initial} className="relative h-full w-full">
              {/* Absolute-fill media container */}
              <div className="relative h-full w-full">
                {tabs.map((t, idx) => (
                  <TabsContent
                    key={t.value}
                    value={t.value}
                    className={cn(
                      "absolute inset-0 m-0 h-full w-full",
                      "data-[state=inactive]:hidden"
                    )}
                  >
                    <img
                      src={t.src}
                      alt={t.alt ?? t.label}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </TabsContent>
                ))}
              </div>

              {/* Tab controls (pill) */}
              <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex w-full justify-center">
                <TabsList className="flex gap-2 rounded-xl border border-border bg-background/80 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                  {tabs.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="rounded-lg px-4 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}


