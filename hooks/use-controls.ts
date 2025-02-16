import { useSwipeable } from 'react-swipeable';
import { useCallback, useEffect } from 'react';

let moveThreshold: number = 0;

interface Actions {
  ArrowLeft?: () => void;
  ArrowRight?: () => void;
  ArrowUp?: () => void;
  ArrowDown?: () => void;
  Space?: () => void;
  SwipeLeft?: () => void;
  SwipeRight?: () => void;
  SwipeUp?: () => void;
  SwipeDown?: () => void;
}


export function useControls(actions: Actions) {

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if(actions["ArrowLeft"])actions["ArrowLeft"]();
        break;
      case "ArrowRight":
        event.preventDefault();
        if(actions["ArrowRight"])actions["ArrowRight"]();
        break;
      case "ArrowUp":
        event.preventDefault();
        if(actions["ArrowUp"])actions["ArrowUp"]();
        break;
      case "ArrowDown":
        event.preventDefault();
        if(actions["ArrowDown"])actions["ArrowDown"]();
        break;
      case " ":
        event.preventDefault();
        if(actions["Space"])actions["Space"]();
        break;
      default: break;
    }
  }, [actions]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  }, [handleKeyPress]);

  const firstThreshold: number = 150;
  const successiveThresholds: number = 50;

  const gestureHandlers = useSwipeable({
    onSwiping: (SwipeEventData) => {
      if (SwipeEventData.first) { moveThreshold = 0; }
      if (SwipeEventData.absX > moveThreshold || SwipeEventData.absY > moveThreshold) {
        if (SwipeEventData.first) { moveThreshold = firstThreshold; }
        else { moveThreshold = moveThreshold + successiveThresholds; }
        switch (SwipeEventData.dir) {
          case 'Left': if(actions["SwipeLeft"])actions["SwipeLeft"](); break;
          case 'Right': if(actions["SwipeRight"])actions["SwipeRight"](); break;
          case 'Up': if(actions["SwipeUp"])actions["SwipeUp"](); break;
          case 'Down': if(actions["SwipeDown"])actions["SwipeDown"](); break;
        }
      }
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
  });

  return gestureHandlers;
}