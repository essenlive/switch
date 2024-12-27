import { cn } from "@/lib/utils"
import { CircleArrowRight, PartyPopper, Trophy, Medal } from "lucide-react"

export function EndScreen({
    className,
    score,
    restart,
    ...props
}) {
    return (
        <div onClick={restart} className={cn("flex flex-col p-4 gap-4 bg-slate-200 rounded-lg cursor-pointer", className)} {...props}>            
            {score.best === null ? (<>
                <>
                    <div className="py-4">
                        <Medal size={32} />
                    </div>
                    <h2 className="text-xl font-bold ">
                        Easy first !
                    </h2>
                    <p className="flex-grow font-normal text-m my-4">
                        You solved the grid in <span className="font-bold">{score.current}</span> moves, that makes it the first score to beat.
                    </p>
                </>
        </> 
        ) : (<>

            {score.current <= score.best ? (
                <>
                    <div className="py-4">
                        <Trophy size={32} />
                    </div>
                    <h2 className="text-xl font-bold ">
                        New highscore !
                    </h2>
                    <p className="flex-grow font-normal text-m my-4">
                                You solved the grid in <span className="font-bold">{score.current}</span> moves. It is <span className="font-bold">{Math.abs(score.current - score.best)}</span> moves less than the previous best.
                    </p>
                </>
            ) : (
                <>
                    <div className="py-4">
                        <PartyPopper size={32} />
                    </div>
                    <h2 className="text-xl font-bold ">
                        Good Job !
                    </h2>
                    <p className="flex-grow font-normal text-m my-4">
                                    You solved the grid in <span className="font-bold">{score.current}</span> moves. Now try to beat the highscore of <span className="font-bold">{score.best}</span> moves.
                    </p>
            </>)}

        </>)}
        <div className="flex justify-between items-center">
            <span className="font-bold">
                Play again
            </span>
            <CircleArrowRight />
        </div>
    </div>
 
    )
}