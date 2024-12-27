import { cn } from "@/lib/utils"
import { Info, Github } from "lucide-react";
import Link from "next/link";

export function Header({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"header">) {
    

    return (
        <header className={cn("flex space-x-4 w-full", className)} {...props}>
            <Link href="/" className="flex-grow flex  items-center p-3 font-bold bg-slate-200 rounded-lg">
                <h1 className="text-2xl uppercase">
                    Switch
                </h1>
            </Link>
            <div className="flex justify-center items-center p-3 aspect-square bg-slate-200 rounded-lg">
                <Info size={24} />
            </div>
            <Link href="/" className="flex justify-center items-center p-3 aspect-square bg-slate-200 rounded-lg">
                <Github size={24} />
            </Link>
        </header>
    )
}
