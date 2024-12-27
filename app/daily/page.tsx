'use client'

import { useSelector } from '@xstate/react';
import { switchActor } from "@/lib/switchMachine"
import { useEffect, useCallback } from 'react'
import { useSwipeable } from 'react-swipeable';
import { EndScreen } from "@/components/endScreen";
import { Score } from "@/components/score";
import { Grid } from "@/components/grid";


const selectContext = ({ context }) => context
const selectState = ({value}) => value


let moveCeiling : number = 0;
const firstCeiling: number = 150;
const successiveCeilings: number = 50;

export default function Home() {
  const context = useSelector(switchActor, selectContext);
  const state = useSelector(switchActor, selectState);

  const gestureHandlers = useSwipeable({
    onSwiping: (SwipeEventData) => {
    
      if (SwipeEventData.first) { moveCeiling = 0 ;}
      if(
        SwipeEventData.absX > moveCeiling
        || SwipeEventData.absY > moveCeiling
      ){
        if (SwipeEventData.first) { 
          moveCeiling = firstCeiling; 
          console.log(`---> First move : ${moveCeiling} | X : ${SwipeEventData.absX} Y : ${SwipeEventData.absY} `)
        }
        else{
          moveCeiling = moveCeiling + successiveCeilings;
          console.log(`---> Next move : ${moveCeiling} | X : ${SwipeEventData.absX} Y : ${SwipeEventData.absY} `)
        }
        switch(SwipeEventData.dir){
          case 'Left':
            switchActor.send({ type: 'input_move', direction: 'left' });
            break;
          case 'Right':
            switchActor.send({ type: 'input_move', direction: 'right' });
            break;
          case 'Up':
            switchActor.send({ type: 'input_move', direction: 'up' });
            break;
          case 'Down':
            switchActor.send({ type: 'input_move', direction: 'down' });
            break;
        }
      }

    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    // trackMouse: true
  });
  const restartGame = () => switchActor.send({ type: 'restart_game', direction: 'down' })

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        switchActor.send({ type: 'input_move', direction: 'left' })
        break;
      case "ArrowRight":
        event.preventDefault()
        switchActor.send({ type: 'input_move', direction: 'right' })
        break;
      case "ArrowUp":
        event.preventDefault()
        switchActor.send({ type: 'input_move', direction: 'up' })
        break;
      case "ArrowDown":
        event.preventDefault()
        switchActor.send({ type: 'input_move', direction: 'down' })
        break;
      case " ":
        event.preventDefault()
          switchActor.send({ type: 'restart_game', direction: 'down' })
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  }, [handleKeyPress]);


  return (
    <main className="flex-grow flex flex-col items-stretch justify-stretch h-full w-full space-y-4">
      
      {
        state === "Game_End" ? 
        <EndScreen
          className={""} 
          restart={restartGame}
          score={context.score}
        />
        : 
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
        restart={restartGame}
        score={context.score}
      />
    </main>


  );
}
