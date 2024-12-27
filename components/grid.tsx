import matrixHelpers from '@/lib/matrixHelpers';
import { cn } from '@/lib/utils';

const BLOCK_COLORS = [
    'bg-slate-100',
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
];
const showValues = false;


export function Grid({
    canva,
    cursor,
    className,
    ...props
}) {


    return (
        <div className={cn("flex-grow flex items-center justify-center flex-col-reverse", className)} {...props}>
                 {matrixHelpers.addPadding(canva, 0).map((row, y) => (
                    <div key={`y-${y}`} className={`y-${y} flex`}>
                        {row.map((cell, x) => (


                            <div
                                key={`x-${x} `}
                                className={cn(
                                    "md:w-8 w-6 md:h-8 h-6 m-1 rounded-sm flex justify-center align-middle text-center",
                                    BLOCK_COLORS[cell],
                                    cursor.y === y && cursor.x === x && BLOCK_COLORS[cursor.value]
                                )}
                            >
                                {showValues && (cursor.y === y && cursor.x === x) ? cursor.value : showValues && cell !== 0 && cell}
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    )
}
