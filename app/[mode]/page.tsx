'use client'

import { useMachine } from '@xstate/react';
import switchMachine from "@/lib/switchMachine"
import { useEffect, useMemo, useState } from 'react'
import { EndScreen } from "@/components/endScreen";
import { Score } from "@/components/score";
import { Grid } from "@/components/grid";
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import { matrixFromParams } from "@/lib/matrixHelpers"
import { useToast } from "@/hooks/use-toast";
import { useControls } from '@/hooks/use-controls';

import { getRandomString } from "@/lib/utils";

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const { mode } = useParams<{ mode: string }>()
  const searchParams = useSearchParams()

  
  
  const { validParams, error, input } = useMemo(() => matrixFromParams({
    s: searchParams.get('s') || '',
    cs: searchParams.get('cs') || '',
    c: searchParams.get('c') || '',
    t: searchParams.get('t') || ''
  }), [searchParams])
  
  // Redirect if params are wrong
  useEffect(() => {
    if (!validParams) {
      toast({
        title: "Wrong url",
        description: `The url is not correct : ${error}, redirecting you.`,
        duration: 5000
      })
      router.push("/")
    }
  }, [validParams, toast, error, router]);
  
  const [snapshot, send] = useMachine(switchMachine, { input: input });
  
  // Add random string to useEffect to avoid hydration errrors
  const [randomString, setRandomString] = useState("");
  useEffect(()=>{
    setRandomString(getRandomString());
    send({ type: "restart_game", params: { input } })
  },[input, send])
  
  const gestureHandlers = useControls({
    "SwipeUp": () => {send({type : "input_move", params : {direction : "up"}})},
    "SwipeRight": () => {send({ type: "input_move", params: { direction: "right" } })},
    "SwipeDown": () => {send({ type: "input_move", params: { direction: "down" } })},
    "SwipeLeft": () => {send({ type: "input_move", params: { direction: "left" } })},
    "ArrowUp": () => {send({ type: "input_move", params: { direction: "up" } })},
    "ArrowRight": () => {send({ type: "input_move", params: { direction: "right" } })},
    "ArrowDown": () => {send({ type: "input_move", params: { direction: "down" } })},
    "ArrowLeft": () => {send({ type: "input_move", params: { direction: "left" } })},
    "Space": () => {send({ type: "restart_game", params: { input: null } })},
  });
  
  return (
    <main className="flex-grow flex flex-col items-stretch justify-stretch h-full w-full space-y-4">
      <EndScreen
          className={""}
          visible={snapshot.value === "Game_End"}
        url={snapshot.context.url}
        initialCanva={snapshot.context.initialCanva}
          restart={() => send({ type: 'restart_game', params: { input: null } })}
          score={snapshot.context.score}
        />
      
      { snapshot.value !== "Game_End" && 
        <div className="flex flex-grow p-4 bg-slate-200 rounded-lg"  {...gestureHandlers}>
          <Grid 
            className={""}
            canva={snapshot.context.canva}
            cursor={snapshot.context.cursor}
          />
        </div>
      }
      <Score
        className={""}
        randomUrl={ mode === "r" ? `/r?s=${randomString}&cs=6x8` : null}
        restart={() => send({ type: 'restart_game', params: { input: null } })}
        score={snapshot.context.score}
      />
    </main>


  );
}
