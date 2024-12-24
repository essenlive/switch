const matrixHelpers = {
    removePadding(canva: number[][]) {
        let trimmedCanva = structuredClone(canva)
        trimmedCanva.pop(); trimmedCanva.shift();
        trimmedCanva.forEach(row => { row.pop(); row.shift(); })
        return trimmedCanva
    },
    addPadding(canva: number[][], value:number) {
        let paddedCanva = structuredClone(canva)
        paddedCanva.forEach(row => {
            row.push(value);
            row.unshift(value);
        })
        paddedCanva.push(Array(paddedCanva[0].length).fill(value));
        paddedCanva.unshift(Array(paddedCanva[0].length).fill(value));
        return paddedCanva
    },
    removeRows(canva: number[][], rowsIndexes: number[]) {
        rowsIndexes = rowsIndexes.sort((a, b) => b - a);
        let newCanva = structuredClone(canva)
        rowsIndexes.forEach(rowIndex => {
            newCanva.splice(rowIndex, 1);
        })

        return newCanva
    },
    removeRow(canva: number[][], rowIndex: number) {
        let newCanva = structuredClone(canva)
        newCanva.splice(rowIndex, 1);
        return newCanva
    },
    removeColumns(canva: number[][], columnsIndexes: number[]) {
        columnsIndexes = columnsIndexes.sort((a, b) => b - a);
        let newCanva = structuredClone(canva)
        newCanva.forEach(row => {
            columnsIndexes.forEach(columnIndex => {
                row.splice(columnIndex, 1);
            })
        });
        return newCanva
    },
    removeColumn(canva: number[][], columnIndex: number) {
        let newCanva = structuredClone(canva)
        newCanva.forEach(row => {
            row.splice(columnIndex, 1);
        });
        return newCanva
    },
    // Add an item to the start of a specific row
    addToRowStart(canva: number[][], rowIndex: number, newItem: number) {
        canva[rowIndex].unshift(newItem);
        let removedValue = canva[rowIndex].pop() ?? newItem  ;
        return {
            removedValue,
            canva
        };
    },

    // Add an item to the end of a specific row
    addToRowEnd(canva: number[][], rowIndex: number, newItem: number) {
        canva[rowIndex].push(newItem);
        let removedValue = canva[rowIndex].shift() ?? newItem;
        return {
            removedValue,
            canva
        };
    },

    // Add an item to the start of a specific column
    addToColumnStart(canva: number[][], columnIndex: number, newItem: number) {

        let itemToShift = newItem;
        canva.forEach(row => {
            // Store the item that will be shifted out
            let tempItemValue = row[columnIndex];
            row[columnIndex] = itemToShift;
            itemToShift = tempItemValue;
        });

        return {
            removedValue: itemToShift,
            canva
        };
    },

    // Add an item to the end of a specific column
    addToColumnEnd(canva: number[][], columnIndex: number, newItem: number) {

        let itemToShift = newItem;
        canva.reverse().forEach(row => {
            // Store the item that will be shifted out
            let tempItemValue = row[columnIndex];
            row[columnIndex] = itemToShift;
            itemToShift = tempItemValue;
        });


        return {
            removedValue: itemToShift,
            canva: canva.reverse()
        };
    },
    checkValues(canva: number[][]) {
        if (!canva || !Array.isArray(canva) || canva.length === 0) {
            throw new Error('Invalid canva: Must be a non-empty array of arrays');
        }
        const result: {
            rows: number[],
            columns: number[],
            // rowValues: number[],
            // columnValues: number[],
        } = {
            rows: [],    // Will store indices of rows with same values
            columns: [], // Will store indices of columns with same values
            // rowValues: [],    // Will store the repeated values found in rows
            // columnValues: []  // Will store the repeated values found in columns
        };

        // Check rows
        canva.forEach((row: number[], rowIndex: number) => {
            if (!Array.isArray(row)) {
                throw new Error(`Invalid row at index ${rowIndex}: Must be an array`);
            }

            if (row.length > 0) {
                const firstValue: number = row[0];
                if (row.every(value => value === firstValue)) {
                    result.rows.push(rowIndex);
                    // result.rowValues.push(firstValue);
                }
            }
        });

        // Check columns
        const columnCount = canva[0].length;
        for (let colIndex = 0; colIndex < columnCount; colIndex++) {
            const firstValue = canva[0][colIndex];
            const isAllSame = canva.every(row => row[colIndex] === firstValue);

            if (isAllSame) {
                result.columns.push(colIndex);
                // result.columnValues.push(firstValue);
            }
        }

        return {
            ...result
        };
    },
};

export default matrixHelpers