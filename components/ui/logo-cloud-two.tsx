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
        <section className="relative overflow-hidden py-16">
            {/* Background removed - using main wrapper gradient */}
            
            <div className="relative z-10 mx-auto max-w-6xl px-6">
                {/* Trusted By Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
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
                            <div className="relative w-full max-w-[160px] h-full opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={160}
                                    height={80}
                                    className="object-contain w-full h-full grayscale"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

