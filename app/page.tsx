'use client'

import { useMachine } from '@xstate/react';
import { swapMachine } from "@/lib/swapMachine"
import { useEffect, useCallback } from 'react'
import matrixHelpers from '@/lib/matrixHelpers';
import { cn } from '@/lib/utils';

const BLOCK_COLORS = [
  '',
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
];


export default function Home() {
  const [snapshot, send] = useMachine(swapMachine);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        send({ type: 'input_move', direction: 'left' })
        break;
      case "ArrowRight":
        event.preventDefault()
        send({ type: 'input_move', direction: 'right' })
        break;
      case "ArrowUp":
        event.preventDefault()
        send({ type: 'input_move', direction: 'up' })
        break;
      case "ArrowDown":
        event.preventDefault()
        send({ type: 'input_move', direction: 'down' })
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  }, [handleKeyPress]);

  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="border-2 border-white flex flex-col-reverse">

      {/* Column indexes */}
        <div key={`hy`} className={`hy flex`}>
        {Array(snapshot.context.canvaSize.width + 3).fill(0).map((col, x) => (
            <div
              key={`col ${x}`}
            className={cn("pt-2 border border-white gray-700 text-center font-mono text-sm", 
              x === 0 ? 'w-24' : 'w-8',
              x === snapshot.context.cursor.x + 1 ? 'font-bold' : '')}
            >
              {x === 0 ? '' : `col ${x-1} `}
            </div>
        ))}
        </div>

        {matrixHelpers.addPadding(snapshot.context.canva, 0).map((row, y) => (
          <div key={`y-${y}`} className={`y-${y} flex`}>
            {/* Row indexes */}
            <div
              key={`row ${y}`}
              className={cn("pr-2 w-24 h-8 border border-white  gray-700 text-right font-mono text-sm",
              y === snapshot.context.cursor.y  ? 'font-bold' : '')}>
              {`row ${y}`}
            </div>

            {row.map((cell, x) => (
              
             
              <div
                key={`x-${x} `}
                className={cn(
                  "w-8 h-8 border border-gray-200 transition-all duration-300 text-center",
                  `x-${x}`,
                  BLOCK_COLORS[cell],
                  snapshot.context.cursor.y === y && snapshot.context.cursor.x === x && BLOCK_COLORS[snapshot.context.cursor.value]
                )}
              >
                {(snapshot.context.cursor.y === y && snapshot.context.cursor.x === x) ? snapshot.context.cursor.value : cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
