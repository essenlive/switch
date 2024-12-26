"use client"

import React from 'react';
import { Square, Star } from 'lucide-react'

import { useSelector } from '@xstate/react';
import { swapActor } from "@/lib/swapMachine"

const selectScore = ({ context }) => context.score
const selectCanvaSize = ({ context }) => context.canvaSize

const Score: React.FC = () => {
    const score = useSelector(swapActor, selectScore);
    const canvaSize = useSelector(swapActor, selectCanvaSize);
    return (
        <div className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold mr-5">{score}</span>
            <Square className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold">{canvaSize.height * canvaSize.width}</span>
        </div>
    );
};

export default Score;