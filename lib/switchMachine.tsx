import { setup, assign, createActor } from "xstate";
import matrixHelpers from "@/lib/matrixHelpers"

const initialValues = {
    cursor: {
        value: 1,
        x: 0,
        y: 0,
    },
    canva: [
        [1, 1, 1, 1, 1, 3, 1, 1],
        [1, 4, 2, 2, 4, 1, 1, 2],
        [4, 3, 4, 3, 2, 4, 4, 1],
        [1, 2, 4, 4, 1, 4, 3, 1],
        [1, 2, 3, 1, 4, 1, 3, 1],
        [1, 4, 1, 3, 2, 2, 1, 1],
        [1, 2, 4, 4, 1, 4, 3, 1],
        [1, 3, 4, 4, 2, 1, 1, 1],
        [1, 2, 4, 4, 1, 4, 3, 1],
        [1, 1, 1, 4, 1, 1, 1, 1],
    ],
    canvaSize: {
        width: 8,
        height: 10,
    },
    level: 1,
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
            level: number;
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
            clonedContext.canva = initialValues.canva;
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
    /** @xstate-layout N4IgpgJg5mDOIC5SwO4EsAuBjAFgOgHEBDAWzAH0BlMDAVwAcBiAbQAYBdRUege1kzQ8AdlxAAPRACYAzAE48ARgUB2BQA5lAVgA0IAJ6IF05QF8Tu1JlyFSFAJIQANmEZoh9WhnIkeANzBsnEggvPwYgiLBEgiSkpp4rMqs0gpxugYxACzSeHFmFujY+MRk5A7Oru6e3n4BCkHcfALCotGx8YnJqTr6iNKs8Vr5IJZFNqXlLm4eXj7+zJINIU3hLVFScQlJKWm9CJmZknhD5iOF1iX2Ti4ATnAYRDcYgaKhzZGgbZudOz0Zmsp5CcClZirZyABhIhCXxEcgAUVhjloRFWQhYHFeKwirT6Kjwmlkxj+iABQM0w1GF3BUJhcMRRGRqIiLHqWLCOPWCBSygJRK06UQADZjMcKacqWDSrTYQikSi0SxFuz3rjufjCcTBQhlIcCZTzjhGHdYA8nngoLYXsE3mi1QBaSS6vCyIWZIWsWRezQKd1C7WSbK5TLe2SHYxCoVqSRmU5CHgQOCiSUqu1c+3SWIut0er2yH1+7UhgmsUusVKxSRqWSmCWG8YUah0eipzmfRCsAOZVgG0ENsrXVtrdsITt7YyZfV1vuXSHQ2UMplpxoc4fiDvazSe3tjWfwoQQIcfdej7VunLisxAA */
    context: {
        score : {
            current : 0,
            best : null
        },
        cursor: initialValues.cursor,
        canva: initialValues.canva,
        canvaSize: initialValues.canvaSize,
        level: initialValues.level
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

        "Game_End": {},

    },

    on: {
        "restart_game": ".Game_Setup"
    }
});

export const switchActor = createActor(switchMachine);
switchActor.start();