'use client'

import Link from "next/link";
import { Sunrise, CircleArrowRight, Timer, Dices, Settings } from "lucide-react";
import { motion } from "motion/react"
import { useToast } from "@/hooks/use-toast";
import { getDailyString, getRandomString } from "@/lib/utils";

export default function Home() {
  const { toast } = useToast()
  const notAvailable = () => {
    toast({
      title: "Mode not available yet",
      description: "I am working on it, stay tuned !",
      duration: 5000
    })
  }
  return (
    <main className="flex-grow flex flex-col items-stretch justfy-stretch h-full w-full space-y-4">
      <Link
        className="flex-grow "
        href={{
          pathname: '/g',
          query: { 
            s: getDailyString(),
            cs: '6x8'
          },
        }} >
        <motion.div whileHover={{ scale: 1.05 }} className="flex-grow flex flex-col p-4 bg-slate-200 cursor-pointer rounded-lg"> 
          <div className="py-4">

            <Sunrise size={32} />
          </div>
          <h2 className="text-2xl font-bold">
            Daily Mode
          </h2>
        <p className="flex-grow text-xl my-4">
            Get a grid that changes everyday. Practice and try to solve the grid with as little moves as possible to improve your high score.  
          </p>
        <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
                Play daily grid
            </span>
            <CircleArrowRight />
          </div>
          </motion.div>
      </Link>

      <Link
        className="flex-grow "
        href={{
          pathname: '/r',
          query: {
            s: getRandomString(),
            cs: '6x8'
          },
        }} >
          <motion.div whileHover={{ scale: 1.05 }} className="flex-grow flex flex-col p-4 bg-slate-200  rounded-lg"> 
          <div className="py-4">

            <Dices size={32} />
          </div>
          <h2 className="text-2xl font-bold ">
            Random Mode
          </h2>
          <p className="flex-grow text-xl my-4">
            Get a random grid everytime, train yourself to spot the best switches in all the different scenarios. 
          </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
              Play random grid
            </span>
            <CircleArrowRight />
          </div >
        </motion.div >
      </Link>
      <Link onClick={notAvailable} href="" className="flex-grow ">
        <motion.div whileHover={{ scale: 1.05 }} className="flex-grow flex flex-col p-4 bg-slate-200  cursor-not-allowed opacity-30 rounded-lg"> 

        <div className="py-4">

          <Settings size={32} />
        </div>
        <h2 className="text-2xl font-bold ">
          Custom Mode
        </h2>
        <p className="flex-grow text-xl my-4">
          Setup the rules of the game. Change the size, the timer and the number of colors.
        </p>
        <div  className="flex justify-between items-center">
          <span className="font-bold text-xl">
            Play  custom grid
          </span>
          <CircleArrowRight />
          </div>
        </motion.div>
      </Link>
      <Link onClick={notAvailable} href="" className="flex-grow ">
        <motion.div whileHover={{ scale: 1.05 }} className="flex-grow flex flex-col p-4 bg-slate-200  cursor-not-allowed opacity-30 rounded-lg">

          <div className="py-4">

            <Timer size={32} />
          </div>
          <h2 className="text-2xl font-bold ">
            Time challenge Mode
          </h2>
          <p className="flex-grow text-xl my-4">
            Solve the grid before it outgrows you.
          </p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">
              Play time challenge grid
            </span>
            <CircleArrowRight />
          </div>
        </motion.div>
      </Link>
    
    </main>

  );
}
