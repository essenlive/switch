import { setup, assign, createActor } from "xstate";
import matrixHelpers from "@/lib/matrixHelpers"

const initialContext = {
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
};

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
        reset_game: assign(({ context }) => {
            return initialContext;
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
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EMAOA6A4mgtmAMpgAuArhgMSyloBOpA+lAWANoAMAuoqBgHtYAS1LCBAOz4gAHogAcAZnlZFnACwA2dQHZNARmXz9+gDQgAnogBMigJxZ1AVkWGd1nfOvX1nRQF9-c1RMLABJCAAbMCphCQxyZnwBADcOHmlBETFJaTkEE2tOVU55JydrfU9NJzNLRDVrLDLXdXtdTTtNaydA4PRsCOjY+MSmZLT2fV4kECzRcSlZ-JMNLG0leTt9bSctcysCnQd1LTtOSp19Tj3Faz6QEMGomLiEpNSOaxn+IQXc5YKZQlLQdQzyYx1Q7GRx2OHw7TdPx2B5PLAAURSaEi5DQYgkUAAwmgJFiqFwfnM-jklqB8rYmpptDdFE4ynYlFUDjZ1PosDo-IZzooDPINKiBhisTi8XEiSSyVNKfMaXlEABaawqfR2Jwc0HaOw+OzchC+ByGLQi-RtNmaPQS0KY7G4-Hy0locnfTLUxZqhCKO5YcpKdrWc6aeSaU2ndT8-VatRG3UooKPSUAdTiVHocDojApPuyfsBCDZOiwgsqNx2ep0ptsJxcbg8Xh8fkdz2GudoDFIhdmKpLdIUNpB2j04MhptZDk0gsUOicOlcnG2gTTEgEEDg0ieRf+tNkGr0WB1evkBvURuvpvVmkrnCfF2XuhXrOcndwbBIFAwB9VUtOgtY4J1sHYOXkBt7CwXVXDufQtXtdx5C-IYwAA4djwKIonErNk9k0NRDBcJwZzZVRmzaQxrgubQv2dGU3WJD1MIBEczQcQj5B0AVFGoqMoRsRdHGbSovF1TZ1C-LMjyHdjsLaJoqyQxMRWsaCVD4xDSgqOxeUXDd-CAA */
    context: initialContext,
    id: "swap",
    initial: "GameSetup",
    states: {
        GameSetup: {
            on: {
                start_game: [
                    {
                        target: "Idle",
                        actions: [
                            { type: "reset_game" }
                        ],
                    }
                ]
            },
        },
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
                restart: {
                    target: "GameSetup",
                    reenter: true
                },
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
            on: {
                restart: {
                    target: "GameSetup",
                    reenter: true
                },
            },
        },

    },
});

export const swapActor = createActor(swapMachine);
swapActor.start();