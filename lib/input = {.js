input = {
    canva: [
        [1, 3],
        [4, 6],
        [7, 9],
    ],
};

let canvaIndexes = {
    "rows": [
        {
            "index": 0,
            "visible": true
        },
        {
            "index": 1,
            "visible": false
        },
        {
            "index": 2,
            "visible": true
        },
    ],
    "columns": [
        {
            "index": 0,
            "visible": false
        },
        {
            "index": 1,
            "visible": true
        },
        {
            "index": 2,
            "visible": true
        },
    ]
}

let canvaRowIndex = 0;
let preparedCanva = canvaIndexes.rows.map((row, rowIndex) => {

    let canvaColumnIndex = 0;
    let preparedRow = canvaIndexes.columns.map((column, columnIndex) => {
        if (column.visible) canvaColumnIndex++

            if (column.visible && row.visible) {
                return input.canva[rowIndex][columnIndex];
            }
            else {
                return null;
            }
        

        });

        if (row.visible) canvaRowIndex++
        return preparedRow;
});

console.log(preparedCanva);

    