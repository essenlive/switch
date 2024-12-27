import Link from "next/link";
import { Sunrise, CircleArrowRight, Timer, Dices } from "lucide-react";

export default function Home() {
 
  return (
    <main className="flex-grow flex flex-col items-stretch justfy-stretch h-full w-full space-y-4">
        <Link href="/daily" className="flex-grow flex flex-col p-4 bg-slate-200 cursor-pointer rounded-lg">
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
        </Link>
        <Link href="/random" className="flex-grow flex flex-col p-4 bg-slate-200 cursor-not-allowed opacity-65 rounded-lg">
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
            <span className="font-bold">
              Play random grid
            </span>
            <CircleArrowRight />
          </div>
        </Link>
        <Link href="/time" className="flex-grow flex flex-col p-4 bg-slate-200 cursor-not-allowed opacity-65 rounded-lg">
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
        </Link>
    
    </main>

  );
}
