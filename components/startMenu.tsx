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

export function StartMenu({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const startGame = () =>{
        swapActor.send({ type: 'start_game', direction: 'down' })
    }

    return (
        <div className={cn("flex flex-col gap-6 fixed w-screen h-screen items-center justify-center", className)} {...props}>
            <Card className=" min-w-64">
                <CardHeader>
                    <CardTitle className="text-2xl">SWAP</CardTitle>
                    <CardDescription>
                        Start game
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={startGame}>
                        <div className="flex flex-col gap-6">
                            <Button type="submit" className="w-full">
                                Start
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
