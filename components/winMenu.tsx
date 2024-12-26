import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { swapActor } from "@/lib/swapMachine"
import { useSelector } from "@xstate/react"

const selectCurrentScore = ({ context }) => context.score.current
const selectBestScore = ({ context }) => context.score.best

export function WinMenu({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const restartGame = () =>{
        swapActor.send({ type: 'restart', direction: 'down' })
    }

    const currentScore = useSelector(swapActor, selectCurrentScore);
    const bestScore = useSelector(swapActor, selectBestScore);
    return (
        <div className={cn("flex flex-col gap-6 absolute", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">You Won !</CardTitle>
                    <CardDescription>
                        Score : {currentScore}
                        {currentScore <= bestScore && "Nouveau record !" }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={restartGame}>
                        <div className="flex flex-col gap-6">
                            <Button type="submit" className="w-full">
                                Play again
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
