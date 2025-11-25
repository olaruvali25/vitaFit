import Image from 'next/image'

const logos = [
    { src: '/logos/myfitnesspal.svg', alt: 'MyFitnessPal' },
    { src: '/logos/fitbit.svg', alt: 'Fitbit' },
    { src: '/logos/strava.svg', alt: 'Strava' },
    { src: '/logos/whoop.svg', alt: 'WHOOP' },
    { src: '/logos/cronometer.svg', alt: 'Cronometer' },
    { src: '/logos/underarmour.svg', alt: 'Under Armour' },
    { src: '/logos/lifesum.svg', alt: 'Lifesum' },
    { src: '/logos/oura.svg', alt: 'Oura' },
]

export default function LogoCloudTwo() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-black py-16">
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
            
            <div className="relative z-10 mx-auto max-w-6xl px-6">
                {/* Trusted By Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                        Trusted By You And By The Biggest Names In The Game
                    </h2>
                </div>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center w-full h-20"
                        >
                            <div className="relative w-full max-w-[160px] h-full opacity-80 hover:opacity-100 transition-opacity duration-300">
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={160}
                                    height={80}
                                    className="object-contain w-full h-full"
                                    style={{
                                        filter: 'brightness(0) invert(1)',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

