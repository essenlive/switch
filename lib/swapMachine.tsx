import { setup, assign, createActor } from "xstate";
import matrixHelpers from "@/lib/matrixHelpers"
export const swapMachine = setup({
    types: {
        context: {} as {
            score: number;
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
            level: number;
        },
        events: {} as
            | { 
                type: "input_move",
                direction: "up" | "down" | "left" | "right"
             }
            | {
                type: "restart",
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
            clonedContext.score = clonedContext.score + 1;
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
    /** @xstate-layout N4IgpgJg5mDOIC5QCUCutYAcCGBjA1gHQCSEANmAMQCWAdpqgC4D6AtgPYBuYA2gAwBdRKEztY1RtXa1hIAB6IAbHwAchAJwBWAOwBGAEwBmXdv2mVmgDQgAnokNHCAFj6KjDzZqdGAvj+toGDgEJORUdAwsHNw8ukJIIKLiktKyCgia6oaE+uqK6up8TtrqurrF1nYI+nx8hLUNTir5ipp+AehYeESkFDT0TGxcvPrxImISUjIJ6Sr6uhrq2pqKhs1NioqViAC0uorOitqKJsorik6t2u0ggV0hAKKc2GSo2JK0UADC2LTPlPwxokJilpqB0ktNPUsup9CoXMt9EZtggVAtNA1VF4VIYioobndgkQni83h9vr9-rEgUlJqkZogyvlDrosXwHK5SiiatpCDiHAUnLoVFpNPoCZ0iYQSa93nQKX9sADRrJaaC0oy+GVCG5NPtNCpTIZFCoVCjcU56saXPNtKaSoZrv5bpLuoQAOp0SgAJzgjGw3sYgNVIKmGoQxktRUMOlxbjW2m0Tm5JUIxvKJy1jpWbWdhLdAHFsKwwABlMCMVCYSiwf2B5hQYu8QQh5JhhkIJyabJmQxOWFHPh5XTqc16Qi6FbzLWbZrzPzO2jsCBwWT5gitulg+SIfTeCcmNHqYp7419lF7dkaI4nZbaPhwjGGCVBN29MCb9Ud-LZe96Y6uJkk5jmohRuCOSI6Ksz55q6jzPLK5I-Iqn7tuCjImLytQlFctS4to5pFIQdoXPspRIg4TgvvcRCetuapoTu1SFAedojieThnsmtiIKahBeCa-Y6CKP74rBr4hEWJblpWmCofS6ERuUE5NF2ej2uBY4LK04Ezia4ELj4QA */
    context: {
        score: 0,
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
    initial: "GameSetup",
    states: {
        Idle: {
            on: {
                input_move: [
                    {
                        target: "Idle",
                        guard: {
                            type: "is_invalid_move",
                        },
                    },
                    {
                        target: "Idle",
                        actions: [
                            { type: "move_cursor"},
                            { type: "increment_score"}
                        ],
                        guard: {
                            type: "is_cursor_move",
                        },
                    },
                    {
                        target: "EvaluatingCanva",
                        actions: [
                            { type: "shift_canva" },
                            { type: "increment_score" }
                        ],
                    },
                ],
            },
        },

        EvaluatingCanva: {
            always: [
                {
                    target: "Win",
                    guard: {
                        type: "is_win_condition",
                    },
                },
                {
                    target: "EvaluatingCanva",
                    actions: {
                        type: "resize_canva",
                    },
                    guard: {
                        type: "is_full_line",
                    },
                    reenter: true,
                },
                {
                    target: "Idle",
                },
            ],
        },

        Win: {
            type: "final",
            on: {
                restart: {
                    target: "GameSetup",
                    reenter: true
                },
            },
        },

        GameSetup: {
            on: {
                start_game: "Idle"
            }
        }
    },
});

export const swapActor = createActor(swapMachine);
swapActor.start();