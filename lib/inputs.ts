export type Direction = "up" | "left" | "down" | "right";

export function getInputListIcons(inputList: Direction[]):string{
    const DIRECTION_ARROWS = new Map(Object.entries({
        'up': "⬆️",
        'right': "➡️",
        'down': "⬇️",
        'left': '⬅️',
    }))
    return inputList.map(input=>DIRECTION_ARROWS.get(input)).join(' ')

}
export function getInputListStringUrl(inputList: Direction[]):string{
    const DIRECTION_CODE = new Map(Object.entries({
        'up': "u",
        'right': "r",
        'down': "d",
        'left': 'l',
    }))
    return inputList.map(input=>DIRECTION_CODE.get(input)).join('')
}

export function getInputsFromStringUrl(inputListStringUrl: string): Direction[] {
  const DIRECTION_NAME = new Map(Object.entries({
        "u": 'up',
        "r": 'right',
        "d": 'down',
        'l': 'left',
    }))
    return inputListStringUrl.split('').map(input => DIRECTION_NAME.get(input) as Direction)
}
export function checkValidInputStringUrl(inputString : string):boolean {
    return (inputString.split('').every(char => ['u', 'r', 'd', 'l'].includes(char)))
}