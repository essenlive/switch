import { addPadding } from '@/lib/matrixHelpers';
import { cn } from '@/lib/utils';
import { motion } from "motion/react";
const BLOCK_COLORS = [
    'bg-slate-100',
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
];
const BLOCK_VALUES = [
    '',
    '❤️',
    '🔷',
    '🟩',
    '🟡',
];
const showValues = false;


export function Grid({
    canva,
    cursor,
    className,
    ...props
}) {


    return (
        <motion.div className={cn("flex-grow flex items-center justify-center flex-col-reverse  gap-2", className)} {...props}>
                 {addPadding(canva, 0).map((row, y) => (
                    <motion.div key={`y-${y}`} className={`y-${y} flex gap-2`}>
                        {row.map((cell, x) => (


                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                key={`x-${x} `}
                                className={cn(
                                    "cursor-pointer aspect-square w-6 h-6 rounded-sm flex justify-center items-center align-middle text-center",
                                    BLOCK_COLORS[cell],
                                    cursor.y === y && cursor.x === x && BLOCK_COLORS[cursor.value]
                                )}
                            >
                                {showValues && (cursor.y === y && cursor.x === x) ? BLOCK_VALUES[cursor.value] : showValues && BLOCK_VALUES[cell]}
                            </motion.div>
                        ))}
                    </motion.div>
                ))}
        </motion.div>
    )
}
