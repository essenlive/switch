'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import matrixHelpers from '@/lib/matrixHelpers';
import { initializeCanva, initializeStaticCanva, calculatePositions, Movement, Canva } from '@/lib/calculatePositions';

// Colors for different block types
const BLOCK_COLORS = [
    '',
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
];

// Game configuration
const GRID_WIDTH = 5;
const GRID_HEIGHT = 10;
const LEVEL = 2;

// const { initialCanva, initialCursor } = initializeGrid(GRID_HEIGHT, GRID_WIDTH, LEVEL)
const { initialCanva, initialCursor } = initializeStaticCanva(GRID_HEIGHT, GRID_WIDTH, LEVEL)

export default function Russpack() {


    const [canva, setGrid] = useState(initialCanva);
    const [cursor, setCursor] = useState(initialCursor);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            let movement : Movement = null;
            switch (e.key) {
                case 'ArrowLeft':
                    movement = 'left';
                break;
                case 'ArrowRight':
                    movement = 'right';
                break;
                case 'ArrowDown':
                    movement = 'down';
                break;
                case 'ArrowUp':
                    movement = 'up';
                break;
            }
            const { newCanva, newCursor } = (calculatePositions(canva, cursor, movement));
            if (newCursor !== null) setCursor(newCursor);
            if (newCanva !== null) setGrid(newCanva);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canva, cursor]);


    console.table(canva)

    return (
        <div className="flex flex-col items-center p-4">
            <div className="border-2 border-gray-200 flex flex-col-reverse">
                {matrixHelpers.addPadding(canva, 0).map((row, y) => (
                <div key={`y-${y}`} className={`y-${y} flex`}>
                    {row.map((cell, x) => (
                        <div
                            suppressHydrationWarning 
                            key={`x-${x} `}
                            className={cn(
                                "w-8 h-8 border border-gray-200 transition-all duration-300 text-center",
                                `x-${x}`,
                                BLOCK_COLORS[cell],
                                cursor.y === y && cursor.x === x && BLOCK_COLORS[cursor.value]
                            )}
                        >
                            {(cursor.y === y && cursor.x === x) ? cursor.value : cell !== 0 && cell}
                        </div>
                    ))}
                </div>
                ))}
            </div>
        </div>
    );
}