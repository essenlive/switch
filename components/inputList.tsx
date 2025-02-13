import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "motion/react";
import { type Direction } from "@/lib/switchMachine";

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
    inputList,
    className,
}:{
    inputList : Direction[];
    className? : string
}) {
    


    return (
        
        <div className={cn("flex space-x-4 items-center  w-full", className)}>
            
            <AnimatePresence>
                 {inputList.map((input, i) => (

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                key={`input-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={transition}
                                className={cn(
                                    "cursor-pointer aspect-square w-6 h-6 rounded-sm flex justify-center items-center align-middle text-center"
                                )}
                            >
                                {DIRECTION_ARROWS.get(input)}
                            </motion.div>
                        ))}
                </AnimatePresence>
        </div>
    )
}
