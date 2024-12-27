import { setup, assign, createActor } from "xstate";
import matrixHelpers from "@/lib/matrixHelpers"
import { getDailyString, generateRandomArray } from "@/lib/utils";

const initialValues = {
    cursor: {
        value: 1,
        x: 0,
        y: 0,
    },
    canvaSize: {
        width: 8,
        height: 10,
    }
};

export const switchMachine = setup({
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
            canvaSize: {
                height: number,
                width: number
            };
        },
        events: {} as
            | { 
                type: "input_move",
                direction: "up" | "down" | "left" | "right"
             }
            | {
                type: "restart_game",
                direction: "up" | "down" | "left" | "right"
            }
            | {
                type: "start_game",
                direction: "up" | "down" | "left" | "right"
            },
    },
    actions: {
        move_cursor: assign({
            cursor: ({ context, event }) => {
                const clonedContext = structuredClone( context );
                switch (event.direction) {
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
        shift_canva: assign(({ context, event }) => {
            const clonedContext = structuredClone(context);
            let newData : {
                removedValue: number,
                canva: number[][]
            } = {
                removedValue: clonedContext.cursor.value,
                canva: clonedContext.canva
            };
            switch (event.direction) {
                case "down":
                    newData = matrixHelpers.addToColumnEnd(
                        clonedContext.canva,
                        clonedContext.cursor.x - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.y = 0;
                    break;
                case "up":
                    newData = matrixHelpers.addToColumnStart(
                        clonedContext.canva,
                        clonedContext.cursor.x - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.y = clonedContext.canvaSize.height + 1;
                    break;
                case "left":
                    newData = matrixHelpers.addToRowEnd(
                        clonedContext.canva,
                        clonedContext.cursor.y - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.x = 0;
                    break;
                case "right":
                    newData = matrixHelpers.addToRowStart(
                        clonedContext.canva,
                        clonedContext.cursor.y - 1,
                        clonedContext.cursor.value,
                    );
                    clonedContext.cursor.x = clonedContext.canvaSize.width + 1;
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

        reset_game: assign(({context}) => {
            const clonedContext = structuredClone(context);
            clonedContext.score.current = 0;
            clonedContext.canva = generateRandomArray(getDailyString(), initialValues.canvaSize.height, initialValues.canvaSize.width );
            clonedContext.canvaSize = initialValues.canvaSize;
            clonedContext.cursor = initialValues.cursor;
            return clonedContext;
        }),
        resize_canva: assign(({ context }) => {
            const clonedContext = structuredClone(context);
            const { rows, columns } = matrixHelpers.checkValues(clonedContext.canva);
            if (rows.length > 0) {
                clonedContext.canva = matrixHelpers.removeRow(
                    clonedContext.canva,
                    rows[0],
                );
                clonedContext.canvaSize.height = clonedContext.canvaSize.height - 1;
                clonedContext.cursor.y =
                    clonedContext.cursor.y === 0 ? 0 : clonedContext.cursor.y - 1;
            } else if (columns.length > 0) {
                clonedContext.canva = matrixHelpers.removeColumn(
                    clonedContext.canva,
                    columns[0],
                );
                clonedContext.canvaSize.width = clonedContext.canvaSize.width - 1;
                clonedContext.cursor.x =
                clonedContext.cursor.x === 0 ? 0 : clonedContext.cursor.x - 1;
            }
            return clonedContext;
        }),
    },
    guards: {
        is_invalid_move: ({ context, event }) => {
            // Check for invalid movements
            if (
                (context.cursor.y <= 0 && event.direction === "down") ||
                (context.cursor.y >= context.canvaSize.height + 1 &&
                    event.direction === "up") ||
                (context.cursor.x <= 0 && event.direction === "left") ||
                (context.cursor.x >= context.canvaSize.width + 1 &&
                    event.direction === "right")
            ) {
                return true;
            }
            return false;
        },
        is_cursor_move: ({ context, event }) => {
            // Check for simple movements
            if (
                ((context.cursor.y === 0 ||
                    context.cursor.y === context.canvaSize.height + 1) &&
                    (event.direction === "left" || event.direction === "right")) ||
                ((context.cursor.x === 0 ||
                    context.cursor.x === context.canvaSize.width + 1) &&
                    (event.direction === "up" || event.direction === "down"))
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
            const { rows, columns } = matrixHelpers.checkValues(context.canva);
            if (rows.length > 0 || columns.length > 0) {
                return true;
            }
            return false;
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EsAuBjAFgYgCc4MBDAjAfShIFswBtABgF1FQAHAe1kzU4Ds2IAB6IALACYANCACeiCWICcAOgDMEiQA4xAViUBGXQDZjhiQF8LM1JlwqA4rTAUAymAwBXdniaskIFw8GHyCAaIIaroSKsYA7AZKumIGjNEGCWIy8ggSUSpKEkrGjHFxagnGklY26Ng4js4UAJIQADZgeGj87J6UNJwAbgwsQkG8AkIRKTFR2loZxgZaJkrZiKZi6gbGaiVxEqVmWjUgtvWNdC3tnd29-UMMBv4c3BNhoBHlcSq6B2KmNRaOIrLTSOQbHQFLRaYoSEwGNSMYqnc72JxXVodLo9PoUAbDegSF6BN4hSbhRAGAyKWL6VIMsRxRhadYIJYxJSMAwArkSIxKDSouroppYzpEWCkch+MZk0JTRBArQqIpmRJAzS7NnLXQqSTFJG6LRqJQLE7WM4ihoYlwAYRI-EGJAoAFFnW1PCRyfxfKMAuMfYqEIjSnSqro9koDsU4myJFVwxrdIxtGJSsK7Damg6nS73SRPd7Qr5nnLggrKQhisYVGUossTYY4kydWUVMDDkolGI9ozdJmLraKLnnW6PV6fb5ieX3sG4roDCpGCkTWk1GoxLCDPGWfqN8aSmCzFEB6d+JwIHAhGicLOg1WALTGNlc9QHZFlGmaVOD0VXdwvHYe9K0+BRuV+PItwODI4mMRR42UDtNBNEx4JSBI-2zTEbhAikwPZLdfkYYw-iSFlYQSNljTUOtTXglYQS0Mwz1qLNLntR0xwLIsH1eCt8JEKkSKXLRGBXZY1GWOJozjCEEDEJD4SZaNdEjaIKiwji3X4CA8I+ISQ1XFQMiMGlyhYio2RSLZ0x5ZZ4L+NI0isKwgA */
    context: {
        score : {
            current : 0,
            best : null
        },
        cursor: initialValues.cursor,
        // canva: generateRandomArray(getDailyString(), initialValues.canvaSize.height, initialValues.canvaSize.width),
        canva: generateRandomArray("test", initialValues.canvaSize.height, initialValues.canvaSize.width),
        canvaSize: initialValues.canvaSize,
    },

    id: "switch",
    initial: "Game_Setup",

    states: {
        "Game_Setup": {
            always: 
                {
                target: "Game_Idle",
                    actions: [
                        { type: "reset_game" }
                    ],
                }
                
        },
        "Game_Idle": {
            on: {
                input_move: [
                    {
                        target: "Game_Idle",
                        guard: {
                            type: "is_invalid_move",
                        },
                    },
                    {
                        target: "Game_Idle",
                        actions: [
                            { type: "move_cursor"},
                            { type: "increment_score"}
                        ],
                        guard: {
                            type: "is_cursor_move",
                        },
                    },
                    {
                        target: "Game_Canva_Evaluation",
                        actions: [
                            { type: "shift_canva" },
                            { type: "increment_score" }
                        ],
                    },
                ],
                restart: {
                    target: "Game_Setup",
                    reenter: true
                },
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

    on: {
        "restart_game": ".Game_Setup"
    }
});

export const switchActor = createActor(switchMachine);
switchActor.start();