import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { type Direction } from "@/lib/switchMachine";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const DIRECTION_ARROWS = new Map(Object.entries({
    'up': "⬆️",
    'right': "➡️",
    'down': "⬇️",
    'left': '⬅️',
}))

const transition = {
    duration: 0.2,
}

export function InputList({
    inputIndex,
    inputList,
    className,
}:{
    inputIndex? : number;
    inputList : Direction[];
    className? : string
}) {
    useEffect( () => {
        // If `scrollToRef` points to an element, then scroll it into view.
        if( scrollToRef.current ) {
            scrollToRef.current.scrollIntoView();
        }
    }, [inputIndex]);    

    const scrollToRef = useRef<HTMLDivElement>(null);

    return (
        
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className={cn("flex space-x-4 items-center min-h-6 my-4", className)}>
                <AnimatePresence>
                    {inputList.map((input, i) => (

                        <motion.div
                            ref={i === inputIndex ? scrollToRef : null}
                            whileHover={{ scale: 1.05 }}
                            key={`input-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                            className={cn(
                                i === inputIndex && "bg-background ring-1 ring-inset",
                                "cursor-pointer aspect-square w-6 h-6 rounded-sm flex justify-center items-center align-middle text-center"
                            )}
                        >
                            {DIRECTION_ARROWS.get(input)}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        <ScrollBar orientation="horizontal" />
    </ScrollArea>
    )
}
