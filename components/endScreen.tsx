import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Share2, CircleArrowRight, PartyPopper, Trophy, Medal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export function EndScreen({
    className,
    score,
    restart,
    ...props
}) {
    const { toast } = useToast()
    const copyToClipboard = () => {
        const date = new Date();
        navigator.clipboard.writeText(`I solved switch ${date.getDate() + 1}/${date.getMonth()+1} in ${score.current} moves. Try yourself ! https://switch.essenlive.xyz`)
        toast({
            title: "Copied to clipboard",
            description: "You can now share your score with your friends",
            duration: 5000
    })}


    return (
        <div className={cn("flex-grow flex flex-col gap-4", className)} {...props}>

    
            <div className={cn("flex-grow relative flex flex-col p-4 bg-slate-200 rounded-lg", className)} {...props}>
                <div onClick={copyToClipboard} className="absolute z-10 top-4 right-4">
                    <Button className="text-xl p-4" >
                        <Share2 /> Share
                    </Button>
                </div>         
            {score.best === null ? (
                <>
                    <div className="py-4">
                        <Medal size={32} />
                    </div>
                    <h2 className="text-2xl font-bold ">
                        Easy first !
                    </h2>
                    <p className="flex-grow text-xl my-4">
                        You solved the grid in <span className="font-bold">{score.current}</span> moves, that makes it the first score to beat.
                    </p>
                </>
        ) : (<>

            {score.current <= score.best ? (
                <>
                    <div className="py-4">
                        <Trophy size={32} />
                    </div>
                    <h2 className="text-2xl font-bold ">
                        New highscore !
                    </h2>
                    <p className="flex-grow text-xl my-4">
                                You solved the grid in <span className="font-bold">{score.current}</span> moves. It is <span className="font-bold">{Math.abs(score.current - score.best)}</span> moves less than the previous best.
                    </p>
                </>
            ) : (
                <>
                    <div className="py-4">
                        <PartyPopper size={32} />
                    </div>
                    <h2 className="text-2xl font-bold ">
                        Good Job !
                    </h2>
                    <p className="flex-grow text-xl my-4">
                        You solved the grid in <span className="font-bold">{score.current}</span> moves. Now try to beat the highscore of <span className="font-bold">{score.best}</span> moves.
                    </p>
            </>
        )}

        </>)}
        </div>

            <div onClick={restart} className="flex justify-between items-center p-4 bg-slate-200 rounded-lg cursor-pointer">
            <span className="font-bold text-xl">
                Play again
            </span>
            <CircleArrowRight />
        </div>
    </div>

    )
}