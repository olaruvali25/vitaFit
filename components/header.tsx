'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'

const menuItems = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [accountDropdownOpen, setAccountDropdownOpen] = React.useState(false)
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const isAccountPage = pathname?.startsWith('/account')

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'max-w-4xl rounded-2xl backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setMenuState(false)}
                                            className={cn(
                                                "block duration-150",
                                                isAccountPage
                                                    ? "text-white hover:text-white/80"
                                                    : "text-gray-900 hover:text-gray-700"
                                            )}>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={cn('in-data-[state=active]:block lg:in-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent', isScrolled ? 'mt-2 border-0 bg-transparent' : 'mb-6 border border-border bg-background')}>
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setMenuState(false)}
                                                className={cn(
                                                    "block duration-150",
                                                    isAccountPage
                                                        ? "text-white hover:text-white/80"
                                                        : "text-gray-900 hover:text-gray-700"
                                                )}>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    {session ? (
                                        <li>
                                            <Link
                                                href="/account"
                                                onClick={() => setMenuState(false)}
                                                className={cn(
                                                    "block duration-150",
                                                    isAccountPage
                                                        ? "text-white hover:text-white/80"
                                                        : "text-gray-900 hover:text-gray-700"
                                                )}>
                                                <span>My Account</span>
                                            </Link>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link
                                                href="/login"
                                                onClick={() => setMenuState(false)}
                                                className={cn(
                                                    "block duration-150",
                                                    isAccountPage
                                                        ? "text-white hover:text-white/80"
                                                        : "text-gray-900 hover:text-gray-700"
                                                )}>
                                                <span>Login</span>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                {session ? (
                                    <>
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    isAccountPage
                                                        ? "text-white hover:text-white/80 hover:bg-white/10"
                                                        : "text-black hover:text-gray-800 hover:bg-gray-100"
                                                )}
                                                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                                                onBlur={() => setTimeout(() => setAccountDropdownOpen(false), 200)}>
                                                <span className={isAccountPage ? "text-white" : undefined}>My Account</span>
                                                <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", accountDropdownOpen && "rotate-180")} />
                                            </Button>
                                            {accountDropdownOpen && (
                                                <div className={cn(
                                                    "absolute right-0 top-full mt-1 w-48 rounded-md border backdrop-blur-lg shadow-lg z-50",
                                                    isAccountPage ? "border-white/20 bg-white/5" : "border-gray-200 bg-white"
                                                )}>
                                                    <div className="py-1">
                                                        <Link
                                                            href="/account"
                                                            onClick={() => {
                                                                setAccountDropdownOpen(false)
                                                                setMenuState(false)
                                                            }}
                                                            className={cn(
                                                              "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                                                              isAccountPage
                                                                ? "text-white hover:bg-white/10"
                                                                : "text-black hover:bg-gray-100"
                                                            )}>
                                                            <User className="h-4 w-4" />
                                                            <span>My Account</span>
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                setAccountDropdownOpen(false)
                                                                setMenuState(false)
                                                                await signOut({ redirect: false })
                                                                router.push('/')
                                                                router.refresh()
                                                            }}
                                                            className={cn(
                                                              "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors",
                                                              isAccountPage
                                                                ? "text-white hover:bg-white/10"
                                                                : "text-black hover:bg-gray-100"
                                                            )}>
                                                            <LogOut className="h-4 w-4" />
                                                            <span>Logout</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="bg-emerald-500 hover:bg-emerald-600">
                                            <Link href="/assessment" onClick={() => setMenuState(false)}>
                                                <span>{isScrolled ? 'New Plan' : 'Start Free Assessment'}</span>
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMenuState(false)}
                                            className={cn(
                                                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3",
                                                isAccountPage
                                                    ? "text-white hover:text-white/80 hover:bg-white/10"
                                                    : "text-gray-900 hover:text-gray-700 hover:bg-gray-100"
                                            )}
                                        >
                                            Login
                                        </Link>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled && 'lg:hidden', 'bg-emerald-500 hover:bg-emerald-600')}>
                                            <Link href="/assessment" onClick={() => setMenuState(false)} className="no-underline">
                                                Start Free Assessment
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn(isScrolled ? 'lg:inline-flex' : 'hidden', 'bg-emerald-500 hover:bg-emerald-600')}>
                                            <Link href="/assessment" onClick={() => setMenuState(false)} className="no-underline">
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
