import { setup, assign } from "xstate";
import { 
    checkValues,
    removeColumn, 
    removeRow, 
    addToColumnEnd, 
    addToColumnStart, 
    addToRowEnd, 
    addToRowStart
} from "@/lib/matrixHelpers"

type Direction = "up" | "left" | "down" | "right";
type Input = {
    canva: number[][],
    timerMode: boolean,
    url: string
}

const switchMachine = setup({
    types: {
        context: {} as {
            score: {
                current: number,
                best : number | null,
            };
            cursor: {
                x: number,
                y: number,
                value: number
            };
            canva: number[][];
            initialCanva: number[][];
            url : string;

        },
        input: {} as Input,
        events: {} as
            | 
            { 
                type: "input_move"
                params: { direction: Direction }
            }
            |
            {
                type: "restart_game"
                params: { input: Input | null}
            }
    },
    actions: {
        move_cursor: assign({
            cursor: ({ context }, params: { direction: Direction }) => {
                
                const clonedContext = structuredClone( context );
                switch (params.direction) {
                    case "up":
                        clonedContext.cursor.y++;
                        break;
                    case "down":
                        clonedContext.cursor.y--;
                        break;
                    case "left":
                        clonedContext.cursor.x--;
                        break;
                    case "right":
                        clonedContext.cursor.x++;
                        break;
                    default:
                        break;
                }
                return clonedContext.cursor;
            },
        }),
        shift_canva: assign(({ context }, params: { direction: Direction }) => {
            const clonedContext = structuredClone(context);
            let newData : {
                removedValue: number,
                canva: number[][]
            } = {
                removedValue: clonedContext.cursor.value,
                canva: clonedContext.canva
            };
            switch (params.direction) {
                case "down":
                    newData = addToColumnEnd(
                        clonedContext.canva,
                        clonedContext.cursor.x - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.y = 0;
                    break;
                case "up":
                    newData = addToColumnStart(
                        clonedContext.canva,
                        clonedContext.cursor.x - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.y = clonedContext.canva.length + 1;
                    break;
                case "left":
                    newData = addToRowEnd(
                        clonedContext.canva,
                        clonedContext.cursor.y - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.x = 0;
                    break;
                case "right":
                    newData = addToRowStart(
                        clonedContext.canva,
                        clonedContext.cursor.y - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.x = clonedContext.canva[0].length + 1;
                    break;
            }
            clonedContext.canva = newData.canva;
            clonedContext.cursor.value = newData.removedValue;
            return clonedContext;
        }),
        increment_score: assign(({ context }) => {
            const clonedContext = structuredClone(context);
            clonedContext.score.current = clonedContext.score.current + 1;
            return clonedContext;
        }),
        update_best_score: assign(({ context }) => {
            
            const clonedContext = structuredClone(context);
            if (clonedContext.score.best === null) {
                clonedContext.score.best = clonedContext.score.current;
            }
            else if (clonedContext.score.current < clonedContext.score.best){
                clonedContext.score.best = clonedContext.score.current;
            }

            return clonedContext;
        }),
        set_game: assign(({ context }, params: { input: Input | null }) => {
            const clonedContext = structuredClone(context);
            clonedContext.score.current = 0;
            clonedContext.cursor = { x: 0, y: 0, value: 1 }
            if(params.input) {
                clonedContext.url = params.input.url;
                clonedContext.canva = structuredClone(params.input.canva);
                clonedContext.initialCanva = structuredClone(params.input.canva);
            }
            else{
                clonedContext.canva = structuredClone(clonedContext.initialCanva);
            }

            return clonedContext;
        }),
        resize_canva: assign(({ context }) => {
            const clonedContext = structuredClone(context);
            const { rows, columns } = checkValues(clonedContext.canva);
            if (rows.length > 0) {
                clonedContext.canva = removeRow(
                    clonedContext.canva,
                    rows[0],
                );
                clonedContext.cursor.y =
                clonedContext.cursor.y === 0 ? 0 : clonedContext.cursor.y - 1;
            } else if (columns.length > 0) {
                clonedContext.canva = removeColumn(
                    clonedContext.canva,
                    columns[0],
                );
                clonedContext.cursor.x =
                clonedContext.cursor.x === 0 ? 0 : clonedContext.cursor.x - 1;
            }
            return clonedContext;
        }),
    },
    guards: {
        is_invalid_move: ({ context }, params: { direction: "up" | "left" | "down" | "right" }) => {
            // Check for invalid movements
            if (
                (context.cursor.y <= 0 && params.direction === "down") ||
                (context.cursor.y >= context.canva.length + 1 && params.direction === "up") ||
                (context.cursor.x <= 0 && params.direction === "left") ||
                (context.cursor.x >= context.canva[0].length + 1 && params.direction === "right")
            ) {
                return true;
            }
            return false;
        },
        is_cursor_move: ({ context }, params: { direction: "up" | "left" | "down" | "right" }) => {
            // Check for simple movements
            if (
                ((context.cursor.y === 0 || context.cursor.y === context.canva.length + 1) && (params.direction === "left" || params.direction === "right")) ||
                ((context.cursor.x === 0 || context.cursor.x === context.canva[0].length + 1) && (params.direction === "up" || params.direction === "down"))
            ) {
                return true;
            }
            return false;
        },
        is_win_condition: ({ context }) => {
            if (context.canva.length <= 1 || context.canva[0].length <= 1) {
                return true;
            }
            return false;
        },
        is_full_line: ({ context }) => {
            const { rows, columns } = checkValues(context.canva);
            if (rows.length > 0 || columns.length > 0) {
                return true;
            }
            return false;
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EsAuBjAFgYgCc4MBDAjAfShIFswBtABgF1FQAHAe1kzU4Ds2IAB6IALACYANCACeiCWICcAOgDMEiQA4xAViUBGXQDZjhiQF8LM1JlwqA4rTAUAymAwBXdniaskIFw8GHyCAaIIaroSKsYA7AZKumIGjNEGCWIy8ggSUSpKEkrGjHFxagnGklY26Ng4js4UAJIQADZgeGj87J6UNJwAbgwsQkG8AkIRKTFR2loZxgZaJkrZiKZi6gbGaiVxEqVmWjUgtvWNdC3tnd29-UMMBv4c3BNhoBHlcSq6B2KmNRaOIrLTSOQbHQFLRaYoSEwGNSMYqnc72JxXVodLo9PoUAbDegSF6BN4hSbhRAGAyKWL6VIMsRxRhadYIJYxJSMAwArkSIxKDSouroppYzpEWCkch+MZk0JTRBArQqIpmRJAzS7NnLXQqSTFJG6LRqJQLE7WM4ihoYlwAYRI-EGJAoAFFnW1PCRyfxfKMAuMfYqEIjSnSqro9koDsU4myJFVwxrdIxtGJSsK7Damg6nS73SRPd7Qr5nnLggrKQhisYVGUossTYY4kydWUVMDDkolGI9ozdJmLraKLnnW6PV6fb5ieX3sG4roDCpGCkTWk1GoxLCDPGWfqN8aSmCzFEB6d+JwIHAhGicLOg1WALTGNlc9QHZFlGmaVOD0VXdwvHYe9K0+BRuV+PItwODI4mMRR42UDtNBNEx4JSBI-2zTEbhAikwPZLdfkYYw-iSFlYQSNljTUOtTXglYQS0Mwz1qLNLntR0xwLIsH1eCt8JEKkSKXLRGBXZY1GWOJozjCEEDEJD4SZaNdEjaIKiwji3X4CA8I+ISQ1XFQMiMGlyhYio2RSLZ0x5ZZ4L+NI0isKwgA */
    context: ({ input }) =>({
        score : {
            current : 0,
            best : null
        },
        cursor: {
            x: 0,
            y: 0,
            value: 1
        },
        url : input.url,
        canva: input.canva,
        initialCanva: input.canva,
    }),

    id: "switch", 
    initial: "Game_Idle",
    on: {
        restart_game: {
            target: "#switch.Game_Idle",
            actions: {
                type: "set_game",
                params: ({ event }) => ({ input: event.params.input })
            },
        },
    },
    states: {
        "Game_Idle": {
            on: {
                input_move: [
                    {
                        target: "Game_Idle",
                        guard: { 
                            type: "is_invalid_move",
                            params: ({ event }) => ({ direction: event.params.direction })
                        },
                    },
                    {
                        target: "Game_Idle",
                        actions: [
                            {
                                type: 'move_cursor',
                                params: ({ event }) => ({ direction: event.params.direction })

                            },
                            { type: "increment_score"}
                        ],
                        guard: {
                            type: "is_cursor_move",
                            params: ({ event }) => ({ direction: event.params.direction })

                        },
                    },
                    {
                        target: "Game_Canva_Evaluation",
                        actions: [
                            { 
                                type: "shift_canva",
                                params: ({ event }) => ({ direction: event.params.direction })
                            },
                            { 
                                type: "increment_score",
                             }
                        ],
                    },
                ],
            },
        },

        "Game_Canva_Evaluation": {
            always: [
                {
                    target: "Game_End",
                    guard: {
                        type: "is_win_condition",
                    },
                },
                {
                    target: "Game_Canva_Evaluation",
                    actions: {
                        type: "resize_canva",
                    },
                    guard: {
                        type: "is_full_line",
                    },
                    reenter: true,
                },
                {
                    target: "Game_Idle",
                },
            ],
        },

        "Game_End": {
            exit: {
                type: "update_best_score",
            },
        },

    },

});


export default switchMachine