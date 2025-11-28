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
        <section className="relative overflow-hidden bg-gradient-to-br from-black via-green-950/20 to-black py-16">
            {/* Green gradient background - matches other sections for smooth blending */}
            <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#18c260]/[0.08] via-green-500/[0.05] to-[#18c260]/[0.08]"></div>
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

