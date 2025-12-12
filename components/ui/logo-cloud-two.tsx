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
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-green-950/20 via-green-950/15 via-green-900/20 via-green-800/25 via-emerald-900/30 via-emerald-800/35 via-emerald-700/40 via-emerald-600/45 via-emerald-500/50 via-emerald-400/55 via-emerald-300/60 via-emerald-200/65 via-emerald-100/70 via-emerald-50/75 to-emerald-50/80 py-16">
            {/* Green gradient background - matches other sections for smooth blending */}
            <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#18c260]/[0.08] via-green-500/[0.05] via-[#18c260]/[0.06] via-[#18c260]/[0.07] via-[#18c260]/[0.08] via-[#18c260]/[0.09] via-[#18c260]/[0.10] via-[#18c260]/[0.11] to-[#18c260]/[0.12]"></div>
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

