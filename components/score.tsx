"use client"

import React from 'react';
import { Square, Star, Tally5 } from 'lucide-react'

import { useSelector } from '@xstate/react';
import { swapActor } from "@/lib/swapMachine"

const selectCurrentScore = ({ context }) => context.score.current
const selectBestScore = ({ context }) => context.score.best
const selectCanvaSize = ({ context }) => context.canvaSize

const Score: React.FC = () => {
    const currentScore = useSelector(swapActor, selectCurrentScore);
    const bestScore = useSelector(swapActor, selectBestScore);
    const canvaSize = useSelector(swapActor, selectCanvaSize);
    return (
        <div className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold mr-5">{bestScore}</span>
            <Tally5 className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold mr-5">{currentScore}</span>
            <Square className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold">{canvaSize.height * canvaSize.width}</span>
        </div>
    );
};

export default Score;