'use client'

import { useMachine } from '@xstate/react';
import switchMachine from "@/lib/switchMachine"
import { useEffect, useMemo, useState } from 'react'
import { EndScreen } from "@/components/endScreen";
import { Score } from "@/components/score";
import { Grid } from "@/components/grid";
import { useSearchParams, useRouter } from 'next/navigation'
import { matrixFromParams } from "@/lib/matrixHelpers"
import { useToast } from "@/hooks/use-toast";
import { useControls } from '@/hooks/use-controls';
import { InputList } from '@/components/inputList';
import { checkValidInputStringUrl, getInputsFromStringUrl } from "@/lib/inputs";

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const s : string = searchParams.get('s') || '', 
    cs: string = searchParams.get('cs') || '',
    c: string = searchParams.get('c') || '',
    t: string = searchParams.get('t') || '',
    i: string = searchParams.get('i') || ''
    // , fh: string = searchParams.get('fh') || ''

  // Get canva from params
  const { validParams, error, input } = useMemo(() => matrixFromParams({ s, cs, c, t }), [s, cs, c, t])
  // Get list inputs from params
  const inputsList = useMemo(() => getInputsFromStringUrl(i), [i])

  // Redirect if params are wrong
  useEffect(() => {
        
    if (!validParams || !checkValidInputStringUrl(i)) {
      toast({
        title: "Wrong url",
        description: `The url is not correct : ${error}, redirecting you.`,
        duration: 5000
      })
      // setTimeout(()=> {router.push("/")}, 1000)
    }
  }, [validParams, inputsList, toast, error, router]);
  
  const [snapshot, send] = useMachine(switchMachine, { input: input });
  const [inputIndex, setInputIndex] = useState(0);
  const sendNextInput = ()=>{ 
    send({type : "input_move", params : {direction : inputsList[inputIndex]}})
    setInputIndex(inputIndex + 1);
    console.log(inputIndex - 1 , inputsList);
    
  }
   useEffect(() => {
    if (snapshot.value !== "Game_End") return
      setInputIndex(0)
  }, [snapshot.value])
  
  const gestureHandlers = useControls({
    "SwipeRight":sendNextInput,
    "SwipeLeft": sendNextInput,
    "ArrowRight": sendNextInput,
    "ArrowDown": sendNextInput,
    "Space": () => {
      setInputIndex(0)
      send({ type: "restart_game", params: { input: null } })
    },
  });
  

  return (
    <main className="flex-grow flex flex-col items-stretch justify-stretch h-full w-full space-y-4">
      <EndScreen
          className={""}
          visible={snapshot.value === "Game_End"}
          url={snapshot.context.url}
          restart={() => send({ type: 'restart_game', params: { input: null } })}
          score={snapshot.context.score}
          inputsList={snapshot.context.inputList}
          highscoreInputs={inputsList}
          highscore={inputsList.length}
          initialCanva={snapshot.context.initialCanva}

        />
      
      { snapshot.value !== "Game_End" && 
        <div className="flex flex-grow p-4 bg-slate-200 rounded-lg relative"  {...gestureHandlers}>
          <h3 className="absolute top-4 left-4 text-slate-500 font-bold text-l">{snapshot.context.url.replace("?","")}</h3>
          <Grid 
            className={""}
            canva={snapshot.context.canva}
            canvaIndexes={snapshot.context.canvaIndexes}
            cursor={snapshot.context.cursor}
          />
        </div>
      }
      <Score
        className={""}
        randomUrl={null}
        restart={() => send({ type: 'restart_game', params: { input: null } })}
        score={snapshot.context.score}
        highscore={i.length}
      />
      <div className=" bg-slate-200 rounded-lg px-4">

              <InputList 
                inputList={inputsList}
                inputIndex={inputIndex - 1} 
                />
      </div>
    </main>


  );
}
