'use client';

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

interface SectionWithMockupProps {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    primaryImageSrc: string;
    secondaryImageSrc: string;
    reverseLayout?: boolean;
}

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
    title,
    description,
    primaryImageSrc,
    secondaryImageSrc,
    reverseLayout = false,
}) => {

    const containerVariants: Variants = {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      };
      
      const itemVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      };
      

    const layoutClasses = reverseLayout
        ? "md:grid-cols-2 md:grid-flow-col-dense"
        : "md:grid-cols-2";

    const textOrderClass = reverseLayout ? "md:col-start-2" : "";
    const imageOrderClass = reverseLayout ? "md:col-start-1" : "";

    return (
        <section className="relative py-24 md:py-48 bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-transparent overflow-hidden w-full">
            <div className="w-full px-4 md:px-8 lg:px-12 relative z-10 mx-auto">
                <motion.div
                     className={`grid grid-cols-1 gap-16 md:gap-8 w-full items-center ${layoutClasses}`}
                     variants={containerVariants}
                     initial="hidden"
                     whileInView="visible"
                     viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Text Content */}
                    <motion.div
                        className={`flex flex-col items-start gap-4 mt-10 md:mt-0 w-full max-w-4xl mx-auto ${textOrderClass}`}
                        variants={itemVariants}
                    >
                         <div className="space-y-2 md:space-y-1">
                            <h2 className="text-gray-900 text-3xl md:text-[40px] font-semibold leading-tight md:leading-[53px]">
                                {title}
                            </h2>
                        </div>

                        <p className="text-gray-700 text-sm md:text-[15px] leading-6">
                            {description}
                        </p>
                         {/* Optional: Add a button or link here */}
                         {/* <div>
                            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md">Learn More</button>
                         </div> */}
                    </motion.div>

                    {/* App mockup/Image Content */}
                    {primaryImageSrc && secondaryImageSrc && (
                        <motion.div
                            className={`relative mt-10 md:mt-0 mx-auto ${imageOrderClass} w-full max-w-[300px] md:max-w-[471px]`}
                            variants={itemVariants}
                        >
                            {/* Decorative Background Element */}
                            <motion.div
                                 className={`absolute w-[300px] h-[317px] md:w-[472px] md:h-[500px] rounded-[32px] z-0 overflow-hidden`}
                                 style={{
                                    top: reverseLayout ? 'auto' : '10%',
                                    bottom: reverseLayout ? '10%' : 'auto',
                                    left: reverseLayout ? 'auto' : '-20%',
                                    right: reverseLayout ? '-20%' : 'auto',
                                    transform: reverseLayout ? 'translate(0, 0)' : 'translateY(10%)',
                                    filter: 'blur(2px)'
                                }}
                                initial={{ y: reverseLayout ? 0 : 0 }}
                                whileInView={{ y: reverseLayout ? -20 : -30 }}
                                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                                viewport={{ once: true, amount: 0.5 }}
                            >
                                <Image
                                    src={secondaryImageSrc}
                                    alt="Decorative background"
                                    width={472}
                                    height={500}
                                    className="w-full h-full object-cover rounded-[32px]"
                                />
                            </motion.div>

                            {/* Main Mockup Card */}
                            <motion.div
                                className="relative w-full h-[405px] md:h-[637px] bg-white/80 rounded-[32px] backdrop-blur-[15px] border border-emerald-200/30 z-10 overflow-hidden shadow-lg"
                                initial={{ y: reverseLayout ? 0 : 0 }}
                                whileInView={{ y: reverseLayout ? 20 : 30 }}
                                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                                 viewport={{ once: true, amount: 0.5 }}
                            >
                                <Image
                                    src={primaryImageSrc}
                                    alt="Main content"
                                    width={471}
                                    height={637}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Decorative bottom gradient */}
            <div
                className="absolute w-full h-px bottom-0 left-0 z-0"
                style={{
                    background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
                }}
            />
        </section>
    );
};

export default SectionWithMockup;

