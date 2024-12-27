'use client'

import { useSelector } from '@xstate/react';
import { swapActor } from "@/lib/swapMachine"
import { useEffect, useCallback } from 'react'
import matrixHelpers from '@/lib/matrixHelpers';
import { cn } from '@/lib/utils';
// import { useToast } from "@/hooks/use-toast"
import { useSwipeable } from 'react-swipeable';
import { WinMenu } from "@/components/winMenu";
import { StartMenu } from "@/components/startMenu";

const BLOCK_COLORS = [
  '', 
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
];
const showValues = false;
const showIndexes = false;

const selectContext = ({ context }) => context
const selectState = ({value}) => value



export default function Home() {
  const context = useSelector(swapActor, selectContext);
  const state = useSelector(swapActor, selectState);
  // const { toast } = useToast()

  
  const handlers = useSwipeable({
    onSwipedLeft: () => swapActor.send({ type: 'input_move', direction: 'left' }),
    onSwipedRight: () => swapActor.send({ type: 'input_move', direction: 'right' }),
    onSwipedUp: () => swapActor.send({ type: 'input_move', direction: 'up' }),
    onSwipedDown: () => swapActor.send({ type: 'input_move', direction: 'down' }),
    // swipeDuration: 500,
    preventScrollOnSwipe: true,
    // trackMouse: true
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        swapActor.send({ type: 'input_move', direction: 'left' })
        break;
      case "ArrowRight":
        event.preventDefault()
        swapActor.send({ type: 'input_move', direction: 'right' })
        break;
      case "ArrowUp":
        event.preventDefault()
        swapActor.send({ type: 'input_move', direction: 'up' })
        break;
      case "ArrowDown":
        event.preventDefault()
        swapActor.send({ type: 'input_move', direction: 'down' })
        break;
      case " ":
        event.preventDefault()
        if (state === 'GameSetup') {
          swapActor.send({ type: 'start_game', direction: 'down' })
        }else{
          swapActor.send({ type: 'restart', direction: 'down' })
        }
        break;
      default:
        break;
    }
  }, [state]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  }, [handleKeyPress]);

  // useEffect(() => {
  //   toast({
  //     title: state,
  //   })
  //   return () => { };
  // }, [state , toast]);

  return (
    <div className="flex items-center flex-col-reverse" {...handlers}>
      {state === "GameSetup" && <StartMenu />}
      {state === "Win" && <WinMenu />}
      {/* Column indexes */}
      {showIndexes && (
        <div key={`hy`} className={`hy flex`}>
        {Array(context.canvaSize.width + 3).fill(0).map((col, x) => (
            <div
              key={`col ${x}`}
            className={cn("m-1 pt-2 gray-700 text-center font-mono text-sm", 
              x === 0 ? 'w-10 md:w-16' : 'md:w-8 w-5',
              x === context.cursor.x + 1 ? 'font-bold' : '')}
            >
              {x === 0 ? '' : `col ${x-1} `}
            </div>
        ))}
        </div>
      )}
        {matrixHelpers.addPadding(context.canva, 0).map((row, y) => (
          <div key={`y-${y}`} className={`y-${y} flex`}>
            {/* Row indexes */}
            {showIndexes && (
              <div
                key={`row ${y}`}
                className={cn("m-1 pr-2 md:w-16 w-10 md:h-8 h-5 gray-700 text-right font-mono text-sm",
                y === context.cursor.y  ? 'font-bold' : '')}>
                {`row ${y}`}
              </div>
            )}

            {row.map((cell, x) => (
              
             
              <div
                key={`x-${x} `}
                className={cn(
                  "md:w-8 w-5 md:h-8 h-5 m-1 rounded-sm transition-all duration-300 flex justify-center align-middle text-center bg-gray-200",
                  `x-${x}`,
                  BLOCK_COLORS[cell],
                  context.cursor.y === y && context.cursor.x === x && BLOCK_COLORS[context.cursor.value]
                )}
              >
                {showValues && (context.cursor.y === y && context.cursor.x === x) ? context.cursor.value : showValues && cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
  );
}
