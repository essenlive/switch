import { createMachine, createActor, assign } from "xstate";
import matrixHelpers from "@/lib/matrixHelpers"
import { createBrowserInspector } from '@statelyai/inspect';

const { inspect } = createBrowserInspector(); 

const russMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QCUCutYAcCGBjA1gHQCSEANmAMQCWAdpqgC4D6AtgPYBuYA2gAwBdRKEztY1RtXa1hIAB6IATAE5lhVQA4AbIr4BmRQHYtAVgCMhgCwAaEAE8lhA4o0a9Z5XzdmTevQF9-WzQMHAIScio6BhYObh4zISQQUXFJaVkFBEUtNSstPh1LRUsTHOUbe0QPPnVLAz4ylzLLDUVA4PQsPCJSChp6JjYuXkUkkTEJKRlkrJKTQi8vZUUfVcszPS1bB2zlLUJDE0tDQ09DRtLCjpAQ7vCAUU5sMlRsSVooAGFsWmfKfjjFKTdIzUBZAqEIxeSxeEqWLSlDQmHaISytKEVGF6dFaTY4m53MJEJ4vN4fb6-f4JIGpKYZWaILSGKGWZTePy5MoaQyohAmQwaQhuZRWDRmTY8raErrEwik17vOiUv7YAFjWR00GZRAAWjMfBZBr0GmUZm0m1Wyj0fNc6j4+y07l85sCQRAtHYEDgsiJPU1IOmOoQ+pMC2NpvNeIMHhtVRDFkUhxhbMMflafAsMtCPQiFADaSDjIQZiMmNMWlMemtejTyj5uuRUJhZU8+jOBPdfsez0VFJ+qoL9LB8mqQosbQleLWZo0fPTmJK3hMmb4XhM2fuRAA6nQh9rizizMKPB54Yoj2G+cc9IRmac9JditaNG7-EA */
        context: {
            cursor: {
                value: 1,
                x: 0,
                y: 0,
            },
            canva: [
                [1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
                [1, 4, 2, 2, 4, 1, 1, 1, 2, 2],
                [4, 3, 4, 3, 2, 4, 4, 1, 4, 1],
                [1, 2, 3, 1, 4, 1, 3, 2, 4, 1],
                [1, 4, 1, 3, 2, 2, 1, 1, 3, 1],
                [1, 2, 4, 4, 1, 4, 3, 4, 3, 1],
                [1, 3, 4, 4, 2, 1, 1, 2, 4, 1],
                [1, 1, 1, 4, 1, 1, 1, 1, 1, 1],
            ],
            canvaSize: {
                width: 10,
                height: 8,
            },
            level: 1,
        },
        id: "Russpack",
        initial: "Idle",
        states: {
            Idle: {
                on: {
                    input_move: [
                        {
                            target: "Idle",
                            guard: "is_invalid_move",
                            actions: [],
                        },
                        {
                            target: "Idle",
                            guard: "is_cursor_move",
                            actions: [
                                {
                                    type: "move_cursor",
                                },
                            ],
                        },
                        {
                            target: "EvaluatingCanva",
                            actions: [
                                {
                                    type: "shift_canva"
                                },
                            ],
                            reenter: true,
                        },
                    ],
                },
            },
            EvaluatingCanva: {
                always: [
                    {
                        target: "Win",
                        guard: "is_win_condition",
                        actions: [],
                    },
                    {
                        target: "EvaluatingCanva",
                        guard: "is_full_line",
                        actions: [
                            {
                                type: "resize_canva",
                            }
                        ],
                        reenter: true,
                    },
                    {
                        target: "Idle",
                        actions: [],
                    },
                ],
            },
            Win: {
                type: "final",
            },
        },
    },
    {
        actions: {
            move_cursor: assign({
                cursor: ({ context, event }) => {
                    let clonedContext = structuredClone(context)

                    switch (event.direction) {
                        case "up": clonedContext.cursor.y++; break;
                        case "down": clonedContext.cursor.y--; break;
                        case "left": clonedContext.cursor.x--; break;
                        case "right": clonedContext.cursor.x++; break;
                        default: break;
                    }
                    return clonedContext.cursor
                },
            }), 
            shift_canva: assign(({ context, event }) => {
                console.log("🔁 shift canva");
                
                    let clonedContext = structuredClone(context);
                    let newData = {
                        removedValue: 0,
                        canva: []
                    }; 
                    switch (event.direction) {
                        case "down":
                            newData = matrixHelpers.addToColumnEnd(clonedContext.canva, clonedContext.cursor.x - 1, clonedContext.cursor.value);
                            clonedContext.cursor.y = 0;
                            break;
                        case "up":
                            newData = matrixHelpers.addToColumnStart(clonedContext.canva, clonedContext.cursor.x - 1, clonedContext.cursor.value)
                            clonedContext.cursor.y = clonedContext.canvaSize.height + 1;
                            break;
                        case "left":
                            newData = matrixHelpers.addToRowEnd(clonedContext.canva, clonedContext.cursor.y - 1, clonedContext.cursor.value);
                            clonedContext.cursor.x = 0;
                            break;
                        case "right":
                            newData = matrixHelpers.addToRowStart(clonedContext.canva, clonedContext.cursor.y - 1, clonedContext.cursor.value);
                            clonedContext.cursor.x = clonedContext.canvaSize.width + 1; 
                            break;
                    }
                    clonedContext.canva = newData.canva;
                    clonedContext.cursor.value = newData.removedValue;

                    return clonedContext
            }),
            resize_canva: assign(({ context, event }) => {
                console.log("📏 resize canva");
                let clonedContext = structuredClone(context);
                let { rows, columns } = matrixHelpers.checkValues(clonedContext.canva);
                console.log("X : ", clonedContext.cursor.x, "| Y : ", clonedContext.cursor.y, "| v : ", clonedContext.cursor.value, "| height : ", clonedContext.canvaSize.height, "| width : ", clonedContext.canvaSize.width);
                if (rows.length > 0){
                    console.log("❇️ Remove rows : ", rows[0]);
                    clonedContext.canva = matrixHelpers.removeRow(clonedContext.canva, rows[0]);
                    clonedContext.canvaSize.height = clonedContext.canvaSize.height - 1;
                    clonedContext.cursor.y = clonedContext.cursor.y === 0 ? 0 : clonedContext.cursor.y - 1;
                }
                else if (columns.length > 0) {
                    console.log("❇️ Remove columns : ", columns[0]);
                    clonedContext.canva = matrixHelpers.removeColumn(clonedContext.canva, columns[0]);
                    clonedContext.canvaSize.width = clonedContext.canvaSize.width - 1;
                    clonedContext.cursor.x = clonedContext.cursor.x === 0 ? 0 : clonedContext.cursor.x - 1;
                }

                console.log("X : ", clonedContext.cursor.x, "| Y : ", clonedContext.cursor.y, "| v : ", clonedContext.cursor.value, "| height : ", clonedContext.canvaSize.height, "| width : ", clonedContext.canvaSize.width);
                return clonedContext
             }),
        },
        actors: {},
        guards: {
            is_invalid_move: ({ context, event }) => {
                // Check for invalid movements
                if (
                    (context.cursor.y <= 0 && event.direction === "down") ||
                    (context.cursor.y >= context.canvaSize.height + 1 && event.direction === "up") ||
                    (context.cursor.x <= 0 && event.direction === "left") ||
                    (context.cursor.x >= context.canvaSize.width + 1 && event.direction === "right")
                ){
                    console.log("🟥 invalid move");
                    return true;
                }
                return false;                    
            },
            is_cursor_move: ({ context, event }) => {               
                // Check for simple movements
                if (
                    ((context.cursor.y === 0 || context.cursor.y === context.canvaSize.height + 1) && (event.direction === 'left' || event.direction === 'right')) || ((context.cursor.x === 0 || context.cursor.x === context.canvaSize.width + 1) && (event.direction === 'up' || event.direction === 'down') )
                ){
                    console.log("✅ simple move");                    
                    return true
                }
                return false;
            },
            is_full_line: ({ context, event }) => {
                let { rows, columns } = matrixHelpers.checkValues(context.canva);
                console.log("📏 check full line");
                if (rows.length > 0 || columns.length > 0){
                    return true;
                }
                return false;
            },
            is_win_condition: ({ context, event }) => {
                console.log("🏆 check win condition");
                if (context.canva.length <= 1 || context.canva.length[0] <= 1) {
                    console.log("🏆 It is a win");
                    return true;
                }
                return false;
            },
        },
        delays: {},
    },
);



export const russPack = createActor(russMachine, {
    inspect,
    // inspect : (inspEv) =>{
    // if (inspEv.type === "@xstate.event") console.log("event :", inspEv.event.type);
    // if (inspEv.type === "@xstate.snapshot") console.log("state :",  inspEv.snapshot.value);

    // }
}
);
russPack.start();