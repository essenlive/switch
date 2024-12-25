"use client"

import React from 'react';
import { Star } from 'lucide-react'

import { useSelector } from '@xstate/react';
import { swapActor } from "@/lib/swapMachine"

const selectScore = ({ context }) => context.score

const Score: React.FC = () => {
    const score = useSelector(swapActor, selectScore);
    return (
        <div className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            <span className="text-lg md:text-xl font-semibold">{score}</span>
        </div>
    );
};

export default Score;