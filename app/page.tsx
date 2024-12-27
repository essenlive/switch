import Link from "next/link";
import { Sunrise, CircleArrowRight } from "lucide-react";

export default function Home() {
 
  return (
    <div className="flex flex-col items-stretch justi fy-stretch h-full w-full space-y-4">
      <Link href="/daily" className="flex-grow flex flex-col p-4 bg-slate-200 rounded-lg">
        <div className="py-4">

          <Sunrise size={32} />
        </div>
        <h2 className="text-xl ">
          Daily Mode
        </h2>
        <p className="flex-grow font-normal text-m my-4">
          Veniam mollit pariatur elit ad adipisicing id elit sunt veniam duis. Nisi anim sunt laboris ut laboris. Ad veniam magna in occaecat minim. Elit amet eu adipisicing reprehenderit cillum officia nostrud ex eiusmod. 
        </p>
        <div className="flex justify-between items-center">
          <span>
            Play daily grid
          </span>
          <CircleArrowRight />
        </div>
      </Link>
      <Link href="/random" className="flex-grow flex flex-col p-4 bg-slate-200 rounded-lg">
        <div className="py-4">

          <Sunrise size={32} />
        </div>
        <h2 className="text-xl ">
          Random Mode
        </h2>
        <p className="flex-grow font-normal text-m my-4">
          Veniam mollit pariatur elit ad adipisicing id elit sunt veniam duis. Nisi anim sunt laboris ut laboris. Ad veniam magna in occaecat minim. Elit amet eu adipisicing reprehenderit cillum officia nostrud ex eiusmod.
        </p>
        <div className="flex justify-between items-center">
          <span>
            Play random grid
          </span>
          <CircleArrowRight />
        </div>
      </Link>
      <Link href="/time" className="flex-grow flex flex-col p-4 bg-slate-200 rounded-lg">
        <div className="py-4">

          <Sunrise size={32} />
        </div>
        <h2 className="text-xl ">
          Time challenge Mode
        </h2>
        <p className="flex-grow font-normal text-m my-4">
          Veniam mollit pariatur elit ad adipisicing id elit sunt veniam duis. Nisi anim sunt laboris ut laboris. Ad veniam magna in occaecat minim. Elit amet eu adipisicing reprehenderit cillum officia nostrud ex eiusmod.
        </p>
        <div className="flex justify-between items-center">
          <span>
            Play time challenge grid
          </span>
          <CircleArrowRight />
        </div>
      </Link>
   
    </div>
  );
}
