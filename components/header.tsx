'use client'

import { cn } from "@/lib/utils"
import { Info, Github, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { HelpScreen } from "@/components/helpScreen";
import React, { useState } from "react";
import { motion } from "motion/react"

export function Header({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"header">) {
    
    const [showHelp, setShowHelp] = useState(false)

    return (
        <>
            <header className={cn("flex space-x-4 w-full", className)} {...props}>
                <Link href="/" className="flex-grow">
                    <motion.div whileHover={{ scale: 1.05 }} className="flex-grow flex  items-center p-3 font-bold bg-slate-200 rounded-lg">
    
                    <ArrowUpDown />
                    <h1 className="ml-4 text-2xl uppercase">
                        Switch
                    </h1>
                    </motion.div>
                </Link>
                <motion.div 
                whileHover={{ scale: 1.1 }} 
                onClick={() => setShowHelp(true) } 
                className="flex justify-center items-center p-3 aspect-square cursor-pointer bg-slate-200 rounded-lg">
                    <Info size={24} />
                </motion.div>
                <Link href="https://github.com/essenlive/switch" target="_blank" rel="noopener noreferrer" className="aspect-square">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex justify-center items-center p-3 aspect-square bg-slate-200 rounded-lg">

                        <Github size={24} />
                    </motion.div>
                </Link>
            </header>
            <HelpScreen visible={showHelp} closeHelp={() => setShowHelp(false)} />
        </> 
    )
}
