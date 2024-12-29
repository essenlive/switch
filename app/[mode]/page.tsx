'use client'

import { useMachine } from '@xstate/react';
import switchMachine from "@/lib/switchMachine"
import { useEffect, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable';
import { EndScreen } from "@/components/endScreen";
import { Score } from "@/components/score";
import { Grid } from "@/components/grid";
import { useSearchParams, useRouter } from 'next/navigation'
import { matrixFromParams } from "@/lib/matrixHelpers"
import { useToast } from "@/hooks/use-toast";


let moveCeiling: number = 0;

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const { validParams, error, input } = matrixFromParams({
    s: searchParams.get('s') || '',
    cs: searchParams.get('cs') || '',
    c: searchParams.get('c') || '',
    t: searchParams.get('t') || ''
  })
  
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

  const context = snapshot.context;
  const state = snapshot.value;

  const firstCeiling: number = 150;
  const successiveCeilings: number = 50;
  const gestureHandlers = useSwipeable({
    onSwiping: (SwipeEventData) => {
    
      if (SwipeEventData.first) { moveCeiling = 0 ;}
      if( SwipeEventData.absX > moveCeiling || SwipeEventData.absY > moveCeiling ){
        if (SwipeEventData.first) { moveCeiling = firstCeiling;}
        else { moveCeiling = moveCeiling + successiveCeilings;}
        switch(SwipeEventData.dir){
          case 'Left':
            send({ type: 'input_move', direction: 'left' });
            break;
          case 'Right':
            send({ type: 'input_move', direction: 'right' });
            break;
          case 'Up':
            send({ type: 'input_move', direction: 'up' });
            break;
          case 'Down':
            send({ type: 'input_move', direction: 'down' });
            break;
        }
      }

    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        send({ type: 'input_move', direction: 'left' })
        break;
      case "ArrowRight":
        event.preventDefault()
        send({ type: 'input_move', direction: 'right' })
        break;
      case "ArrowUp":
        event.preventDefault()
        send({ type: 'input_move', direction: 'up' })
        break;
      case "ArrowDown":
        event.preventDefault()
        send({ type: 'input_move', direction: 'down' })
        break;
      case " ":
        event.preventDefault()
          send({ type: 'restart_game', direction: 'down' })
        break;
      default:
        break;
    }
  }, [send]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  }, [handleKeyPress]);


  return (
    <main className="flex-grow flex flex-col items-stretch justify-stretch h-full w-full space-y-4">
      <EndScreen
          className={""}
          visible={state === "Game_End"}
          restart={() => send({ type: 'restart_game', direction: 'down' })}
          score={context.score}
        />
      
      { state !== "Game_End" && 
        <div className="flex flex-grow p-4 bg-slate-200 rounded-lg"  {...gestureHandlers}>
          <Grid 
            className={""}
            canva={context.canva}
            cursor={context.cursor}
          />
        </div>
      }
      <Score
        className={""}
        restart={() => send({ type: 'restart_game', direction: 'down' })}
        score={context.score}
      />
    </main>


  );
}
