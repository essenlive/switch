import { cn } from "@/lib/utils"
import { RotateCcw, Trophy, MoveHorizontal, Dices } from "lucide-react";
import Link from "next/link";
import { getRandomString } from "@/lib/utils";
import { motion } from "motion/react";
export function Score({
    className,
    score,
    restart,
    mode,
    ...props
}) {


    return (
        <div className={cn("flex space-x-4 w-full", className)} {...props}>
            <div className="flex-grow flex  items-center p-3 bg-slate-200 rounded-lg">
                <MoveHorizontal />
                <span className="ml-4 text-xl font-bold">
                    {score.current}
                </span>
            </div>
            {mode === "r" &&
                <Link
                    className="flex"
                    href={{
                        pathname: '/r',
                        query: {
                            s: getRandomString(),
                            cs: '6x8'
                        },
                    }} >
                    <motion.div whileHover={{ scale: 1.1 }} className="flex justify-center items-center p-3 aspect-square cursor-pointer bg-slate-200 rounded-lg">

                        <Dices />
                    </motion.div>
                </Link>
            }          
            <motion.div whileHover={{ scale: 1.1 }} className="flex justify-center items-center p-3 aspect-square cursor-pointer bg-slate-200 rounded-lg" onClick={restart}>
                <RotateCcw />
            </motion.div>
            <div className="flex-grow flex justify-end items-center p-3 bg-slate-200 rounded-lg">
                <span className="mr-4 text-xl font-bold">
                    {score.best === null ? "-" : score.best}
                </span>
                <Trophy />
            </div>
        </div>
    )
}
