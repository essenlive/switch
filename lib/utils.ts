import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Prando from 'prando';

// var rand = require('random-seed').create();
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Turn string to hash number
function hashStringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// Get string from daily date
export function getDailyString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}${month}${day}`;
}


// Generate random array from seed number !! This is not good code !! 
export function generateRandomArray(str: string, rows: number, cols: number): number[][] {
  // const seed = hashStringToSeed(str);
  let rng = new Prando(str);
  const randomArray: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      const randomValue = Math.floor(rng.next(1, 5));
      row.push(randomValue);
    }
    randomArray.push(row);
  }

  // Check for lines and reset

  
  return randomArray;
}
