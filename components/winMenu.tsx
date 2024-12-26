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
        <div className={cn("flex flex-col gap-6 fixed w-screen h-screen items-center justify-center", className)} {...props}>
            <Card className=" min-w-64">
                <CardHeader>
                    <CardTitle className="text-2xl">You Won !</CardTitle>
                    <CardDescription>
                        <p>
                            Score : {currentScore}
                        </p>
                        {currentScore <= bestScore && (<p className="font-bold">Nouveau record !</p>) }
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
