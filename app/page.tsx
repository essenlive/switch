'use client'

import { useSelector } from '@xstate/react';
// import { russPack } from "@/lib/russMachine"
import { swapActor } from "@/lib/swapMachine"
import { useEffect, useCallback } from 'react'
import matrixHelpers from '@/lib/matrixHelpers';
import { cn } from '@/lib/utils';

export type Cursor = {
  x: number,
  y: number,
  value: number
}
export type Canva = number[][]
export type CanvaSize = {
  height: number,
  width: number
}

const BLOCK_COLORS = [
  '',
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
];
// tip: optimize selectors by defining them externally when possible
const selectContext = (snapshot: any) => snapshot.context;
// const selectCursor = (snapshot: any) => snapshot.context.cursor;
// const selectCanva = (snapshot: any) => snapshot.context.canva;
// const selectCanvaSize =(snapshot: any) => snapshot.context.canvaSize;


export default function Home() {
  const context = useSelector(swapActor, selectContext);
  // const canva: Canva = useSelector(russPack, selectCanva);
  // const cursor: Cursor = useSelector(russPack, selectCursor);
  // const canvaSize: CanvaSize  = useSelector(russPack, selectCanvaSize);

  // console.log('canva', context.canva);
  // console.log('cursor', context.cursor);  
  // console.log('size', context.canvaSize);
  

  // console.log("X : ", context.cursor.x, "| Y : ", context.cursor.y, "| v : ", context.cursor.value, "| height : ", context.canvaSize.height, "| width : ", context.canvaSize.width);

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
        {Array(context.canvaSize.width + 3).fill(0).map((col, x) => (
            <div
              key={`col ${x}`}
            className={cn("pt-2 border border-white gray-700 text-center font-mono text-sm", 
              x === 0 ? 'w-24' : 'w-8',
              x === context.cursor.x + 1 ? 'font-bold' : '')}
            >
              {x === 0 ? '' : `col ${x-1} `}
            </div>
        ))}
        </div>

        {matrixHelpers.addPadding(context.canva, 0).map((row, y) => (
          <div key={`y-${y}`} className={`y-${y} flex`}>
            {/* Row indexes */}
            <div
              key={`row ${y}`}
              className={cn("pr-2 w-24 h-8 border border-white  gray-700 text-right font-mono text-sm",
              y === context.cursor.y  ? 'font-bold' : '')}>
              {`row ${y}`}
            </div>

            {row.map((cell, x) => (
              
             
              <div
                key={`x-${x} `}
                className={cn(
                  "w-8 h-8 border border-gray-200 transition-all duration-300 text-center",
                  `x-${x}`,
                  BLOCK_COLORS[cell],
                  context.cursor.y === y && context.cursor.x === x && BLOCK_COLORS[context.cursor.value]
                )}
              >
                {(context.cursor.y === y && context.cursor.x === x) ? context.cursor.value : cell !== 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
