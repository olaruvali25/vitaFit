"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface Feature197Props {
  features: FeatureItem[];
}

const Feature197 = ({ features }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0]?.image || "");

  useEffect(() => {
    if (features[0]?.image) {
      setActiveImage(features[0].image);
    }
  }, [features]);

  const handleAccordionToggle = (value: string) => {
    const id = parseInt(value.replace("item-", ""));
    const feature = features.find((f) => f.id === id);
    if (feature) {
      setActiveImage(feature.image);
      setActiveTabId(id);
    }
  };

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex w-full flex-col md:flex-row items-start justify-between gap-12">
          <div className="w-full md:w-1/2">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#18c260] mb-3">
                Everything You Need to Succeed
              </h2>
              <p className="text-black/70 text-lg">
                Discover how VitaFit transforms your health and fitness journey
              </p>
            </div>
            
            <div className="relative">
              <GlowingEffect spread={50} blur={25} borderWidth={2} />
              <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl p-6">
                <Accordion 
                  type="single" 
                  className="w-full" 
                  defaultValue="item-1"
                  onValueChange={(value) => {
                    if (value) {
                      handleAccordionToggle(value)
                    }
                  }}
                >
                  {features.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    return (
                      <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                        <AccordionTrigger 
                          className="cursor-pointer py-5 !no-underline transition hover:text-[#18c260] text-left"
                        >
                          <h6
                            className={`text-xl font-semibold ${
                              isActive
                                ? "text-[#18c260]"
                                : "text-black/80"
                            }`}
                          >
                            {tab.title}
                          </h6>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <p className="mt-3 text-black/70 leading-relaxed">
                              {tab.description}
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-black/60 text-sm">
                              {tab.id === 1 && (
                                <>
                                  <li>Meal prep guides and shopping lists</li>
                                  <li>Calorie and macro tracking</li>
                                  <li>Dietary restriction accommodations</li>
                                </>
                              )}
                              {tab.id === 2 && (
                                <>
                                  <li>Adaptive menus for travel, workdays, and celebrations</li>
                                  <li>Layered macro targets for each meal period</li>
                                  <li>Smart ingredient swaps that keep flavor and totals intact</li>
                                </>
                              )}
                              {tab.id === 3 && (
                                <>
                                  <li>Weekly weight and measurement tracking</li>
                                  <li>Visual progress charts and graphs</li>
                                  <li>Automatic plan adjustments</li>
                                </>
                              )}
                              {tab.id === 4 && (
                                <>
                                  <li>24/7 access to nutrition tips</li>
                                  <li>Recipe variations and substitutions</li>
                                  <li>Community support and motivation</li>
                                </>
                              )}
                              {tab.id === 5 && (
                                <>
                                  <li>Pause, swap, or reschedule meals anytime</li>
                                  <li>Grocery lists that shift with your plan</li>
                                  <li>Works with your busy schedule</li>
                                </>
                              )}
                            </ul>
                          </div>
                          <div className="mt-4 md:hidden">
                            <div className="relative rounded-md overflow-hidden">
                              <GlowingEffect spread={30} blur={15} borderWidth={2} />
                              <img
                                src={tab.image}
                                alt={tab.title}
                                className="h-full max-h-80 w-full rounded-md object-cover"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </div>
          
          <div className="relative m-auto hidden w-1/2 overflow-hidden rounded-xl md:block">
            <GlowingEffect spread={50} blur={25} borderWidth={2} />
            <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm p-4">
              <img
                src={activeImage}
                alt="Feature preview"
                className="aspect-[4/3] rounded-md object-cover w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature197 };

