import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-12 px-6 overflow-hidden",
                "bg-slate-900/80 dark:bg-slate-100",
                "border border-emerald-500/30",
                "transition-all duration-200",
                "group",
                "hover:border-emerald-400/50",
                className
            )}
            {...props}
        >
            {/* Gradient background effect - emerald/green theme */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
                    "opacity-0 group-hover:opacity-20",
                    "blur-xl transition-opacity duration-500"
                )}
            />
            
            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-white dark:text-slate-900 font-semibold text-sm">
                    {label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 dark:text-emerald-600 group-hover:text-emerald-300 transition-colors" />
            </div>
        </Button>
    );
}

