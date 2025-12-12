"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

export function FreeTrialPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before in this session
    const shown = sessionStorage.getItem("freeTrialPopupShown");
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleScroll = () => {
      // Show popup when user scrolls to pricing section (approximately 60% down the page)
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      // Also check if pricing section is in view
      const pricingSection = document.querySelector('[data-pricing-section]');
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if ((scrollPercentage > 50 || isInView) && !hasShown) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem("freeTrialPopupShown", "true");
        }
      } else if (scrollPercentage > 50 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("freeTrialPopupShown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl p-8 max-w-md w-full">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18c260] rounded-full mb-4">
                  <span className="text-2xl font-bold text-white">14</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  14 Day Free Trial
                </h2>
                
                <p className="text-white/80 mb-6">
                  Try VitaFit risk-free for 14 days. No credit card required. Cancel anytime.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="bg-[#18c260] hover:bg-[#1FCC5F] text-white flex-1"
                  >
                    <a href="/assessment">Start Free Trial</a>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-white/30 text-white hover:bg-white/10 flex-1"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

