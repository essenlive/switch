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
            console.log("\\uD83D\\uDD01 shift canva");
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
            console.log("\\uD83D\\uDCCF resize canva");
            const clonedContext = structuredClone(context);
            const { rows, columns } = matrixHelpers.checkValues(clonedContext.canva);
            if (rows.length > 0) {
                console.log("\\u2747\\uFE0F Remove rows : ", rows[0]);
                clonedContext.canva = matrixHelpers.removeRow(
                    clonedContext.canva,
                    rows[0],
                );
                clonedContext.canvaSize.height = clonedContext.canvaSize.height - 1;
                clonedContext.cursor.y =
                    clonedContext.cursor.y === 0 ? 0 : clonedContext.cursor.y - 1;
            } else if (columns.length > 0) {
                console.log("\\u2747\\uFE0F Remove columns : ", columns[0]);
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
                console.log("\\uD83D\\uDFE5 invalid move");
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
                console.log("\\u2705 simple move");
                return true;
            }
            return false;
        },
        is_win_condition: ({ context }) => {
            console.log("\\uD83C\\uDFC6 check win condition");
            if (context.canva.length <= 1 || context.canva[0].length <= 1) {
                console.log("\\uD83C\\uDFC6 It is a win");
                return true;
            }
            return false;
        },
        is_full_line: ({ context }) => {
            const { rows, columns } = matrixHelpers.checkValues(context.canva);
            console.log("\\uD83D\\uDCCF check full line");
            if (rows.length > 0 || columns.length > 0) {
                return true;
            }
            return false;
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QCUCutYAcCGBjA1gHQDKYALqpgMSxnYBOZA+lNgLZgDaADALqKhMAe1gBLMqKEA7ASAAeiABwAmRYQCMAdgCcANk26AzABZji3d10AaEAE9Ey5QFZC2g04tvHm40YC+fjZoGDgEhACSEAA2YFSiUpiozGxCAG5cfLLCYhLSsgoI6urc3BqKhk6a5pqGhpqaTjb2hVWEhsq6HtzKtcrqyprKAUHoWHhEkTFxCUlMKemc6vxIINnikjIrBYrqxoSK5bWK3E7GNb5NDnqEysbF7bs+uha6wyDBY2GTsfGJyWlcZTLQQidZ5LZKVQaHT6IymcyWS4IHaEJwlErOJw9GqGV6Bd6jUJEACiqWwUVQ2AkUigAGFsFIyVQeMDVqDcptQAVbspCM9jJZ1LiTooBeokY41I5Op4sWdcYo3h8iYRSeTKdS6QymYtWWsOflEHdXNpTWbzabzBLDNo2tpRYYduZ1IoPJolYTxqqyRSqfEtYzsMygVl2RtDQgeXzdALdEKLE5RdxxXZECY1G4ZQrDCcnE4PSEvQB1eJUehwOiMFmhnLhiEIJxuQjcQz9G3FPPGbQS5yudyeQYDXyGAL4qRCCBwWTK8Y1sGc+SIAC0umb6PXG92SJXa-XyjcJh6zgLnyIpAomDnBvrmm4tq0enqfTjyc0PdXZxlce0jg8Q3xM5fNEYBXnWXKIEUoquLUia7NwDSGNahj7B0HgeNoxh1LoHQniqaq+pq9KBqB4LgQgXaor4iiaC6ByNmi3apggtSrhU6iVMm+hOHU5S4cW8QkQuBSmLyLb9AK+7Ck47E9i40oeK6R5mPmo5AA */
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
    initial: "Idle",
    states: {
        Setup: {
            on: {
                start_game: {
                    target: "Idle",
                },
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
                    target: "Setup",
                },
            },
        },
    },
});

export const swapActor = createActor(swapMachine);
swapActor.start();