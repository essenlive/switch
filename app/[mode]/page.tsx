'use client'

import { useMachine } from '@xstate/react';
import switchMachine from "@/lib/switchMachine"
import { useEffect, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable';
import { EndScreen } from "@/components/endScreen";
import { Score } from "@/components/score";
import { Grid } from "@/components/grid";
import { useSearchParams, useParams, useRouter } from 'next/navigation'
import { matrixFromParams } from "@/lib/matrixHelpers"
import { useToast } from "@/hooks/use-toast";

let moveThreshold: number = 0;

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  // Get route params to get the mode 
  const { mode } = useParams<{ mode: string }>()
  // Get query parameters for generating the grid
  const searchParams = useSearchParams()


  const { validParams, error, input } = matrixFromParams({
    s: searchParams.get('s') || '',
    cs: searchParams.get('cs') || '',
    c: searchParams.get('c') || '',
    t: searchParams.get('t') || ''
  })
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

  useEffect(() => {
    send({ type: 'restart_game', params: { input: input } })
  }, [input, send])


  const firstThreshold: number = 150;
  const successiveThresholds: number = 50;
  const gestureHandlers = useSwipeable({
    onSwiping: (SwipeEventData) => {
    
      if (SwipeEventData.first) { moveThreshold = 0 ;}
      if( SwipeEventData.absX > moveThreshold || SwipeEventData.absY > moveThreshold ){
        if (SwipeEventData.first) { moveThreshold = firstThreshold;}
        else { moveThreshold = moveThreshold + successiveThresholds;}
        switch(SwipeEventData.dir){
          case 'Left':
            send({ type: 'input_move', params : {direction: 'left' }});
            break;
          case 'Right':
            send({ type: 'input_move', params: { direction: 'right' }});
            break;
          case 'Up':
            send({ type: 'input_move', params: { direction: 'up' } });
            break;
          case 'Down':
            send({ type: 'input_move', params: { direction: 'down' } });
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
        send({ type: 'input_move', params: { direction: 'left' }})
        break;
      case "ArrowRight":
        event.preventDefault()
        send({ type: 'input_move',  params : {direction: 'right' }})
        break;
      case "ArrowUp":
        event.preventDefault()
        send({ type: 'input_move',  params : {direction: 'up' }})
        break;
      case "ArrowDown":
        event.preventDefault()
        send({ type: 'input_move',  params : {direction: 'down' }})
        break;
      case " ":
        event.preventDefault()
        send({ type: 'restart_game', params: { input: null } })
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
        mode={mode}
        restart={() => send({ type: 'restart_game', params: { input: null } })}
        score={snapshot.context.score}
      />
    </main>


  );
}
