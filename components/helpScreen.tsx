import { cn } from "@/lib/utils"
import { Move, BookText, CircleX } from "lucide-react"


export function HelpScreen({
    className,
    closeHelp,
    ...props
}:{ 
    className?: string,
    closeHelp: () => void
 }) {
    return (
        <div onClick={closeHelp} className={cn("fixed z-10 top-0 left-0 !my-0 w-full space-y-4 bg-gray-100", className)} {...props}>   
            <div className={"p-4 flex flex-col items-stretch justify-stretch min-h-dvh max-w-xl mx-auto space-y-4"}>   
                <div className="flex-grow flex flex-col p-4 bg-slate-200 cursor-pointer rounded-lg">
                    <div className="py-4">

                        <BookText size={32} />
                    </div>
                <h2 className="text-xl font-bold my-4">
                        Rules
                </h2>
                <p className="text-xl mt-1">
                    Move your cursor to switch the lines, try to align the same colors on the same column or line to make it disappear.
                </p>
                <p className="text-xl mt-1">
                    Once you the grid is only one square wide in any direction, you have won !
                </p>
                <p className="text-xl mt-1">
                    Try to make the best score by solving the grid in the least amount of moves.
                </p>
                </div>
               
            <div className="flex-grow flex flex-col p-4 bg-slate-200 cursor-pointer rounded-lg">
                <div className="py-4">

                    <Move size={32} />
                </div>
                <h2 className="text-xl font-bold my-4">
                    Controls
                </h2>
                <p className="text-xl mt-1">
                    Either swipe or use the arrows to move the cursor in the right direction. 
                </p>
                <p className="opacity-30 text-xl mt-1">
                    Use shift or long swipe to go faster.
                </p>
                <p className="text-xl mt-1">
                    Press space or restart button to restart the game.
                </p>
            </div>
        </div>
    
        <div onClick={closeHelp}  className="absolute z-10 p-4 top-0 right-4">
            <CircleX size={32} />
            </div>
        </div>

    )
}