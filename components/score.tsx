import { cn } from "@/lib/utils"
import { RotateCcw, Trophy, MoveHorizontal } from "lucide-react";

export function Score({
    className,
    score,
    restart,
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
            <div className="flex justify-center items-center p-3 aspect-square cursor-pointer bg-slate-200 rounded-lg" onClick={restart}>
                <RotateCcw />
            </div>
            <div className="flex-grow flex justify-end items-center p-3 bg-slate-200 rounded-lg">
                <span className="mr-4 text-xl font-bold">
                    {score.best === null ? "-" : score.best}
                </span>
                <Trophy />
            </div>
        </div>
    )
}
