import * as constants from "./constants";

export const canMove = (position, blockedPoints, moveDirection) => {
    switch (moveDirection) {
        case constants.directionLeft:
            return position.x !== 1 && !blockedPoints.some(pos => (pos.x === position.x - 1 && pos.y === position.y));
        case constants.directionUp:
            return position.y !== 1 && !blockedPoints.some(pos => (pos.x === position.x && pos.y === position.y - 1));
        case constants.directionRight:
            return position.x !== constants.boardXSize && !blockedPoints.some(pos => (pos.x === position.x + 1 && pos.y === position.y));
        case constants.directionDown:
            return position.y !== constants.boardYSize && !blockedPoints.some(pos => (pos.x === position.x && pos.y === position.y + 1));
        default:
            return false;
    }
}

export const generatePoint = () => {
    return {x: 1 + Math.floor(Math.random() * 8), y: 1 + Math.floor(Math.random() * 8)};
}

export const isPointInBlockedPoints = (blockedPoints, point) => {
    return blockedPoints.some(pos => (pos.x === point.x && pos.y === point.y));
}

export const isNotEqualPoints = (point1, point2) => {
    return point1.x !== point2.x && point1.y !== point2.y;
}

export const isEqualPoints = (point1, point2) => {
    return point1.x === point2.x && point1.y === point2.y;
}

export const generateBoard = () => {
    const board = [];
    for(let i = 0; i < constants.boardXSize; i++) {
        for (let j = 0; j < constants.boardYSize; j++) {
            board.push( {x: j + 1, y: i + 1} );
        }
    }
    return board;
}

const neighbourCheck = (aMatrix, x, y, pos) =>
{
    return aMatrix[y] && (aMatrix[y][x] === 0) && !(x === pos.x - 1 && y === pos.y - 1);
}

export const pathFinder = (aMatrix, enemyPos, heroPosition) => {
    const toVisit = [[enemyPos.x - 1, enemyPos.y - 1]]; // Initialise at the start square

    while(toVisit.length)
    { // While there are still squares to visit
        let x = toVisit[0][0];
        let y = toVisit[0][1];

        if (neighbourCheck(aMatrix, x-1,y, enemyPos)) {
            aMatrix[y][x-1] = aMatrix[y][x] + 1;
            toVisit.push([x-1, y]);
        }
        if (neighbourCheck(aMatrix, x+1,y, enemyPos)) {
            aMatrix[y][x+1] = aMatrix[y][x] + 1;
            toVisit.push([x+1, y]);
        }
        if (neighbourCheck(aMatrix, x,y-1, enemyPos)) {
            aMatrix[y-1][x] = aMatrix[y][x] + 1;
            toVisit.push([x, y-1]);
        }
        if (neighbourCheck(aMatrix, x,y+1, enemyPos)) {
            aMatrix[y+1][x] = aMatrix[y][x] + 1;
            toVisit.push([x, y+1]);
        }
        toVisit.shift();
    }

    const distance = aMatrix[heroPosition.y - 1][heroPosition.x - 1];
    return [aMatrix, distance];
}

export const backtrace = (aMatrix, enemyPos, heroPosition) => {
    let previousValue = aMatrix[heroPosition.y - 1][heroPosition.x - 1];
    const successfulRoute = [];
    let x = heroPosition.x - 1;
    let y = heroPosition.y - 1;

    while ( !(x === enemyPos.x - 1 && y === enemyPos.y - 1) ) {
        for (let i = x-1; i < x+2; i++) {
            for (let j = y-1; j < y+2; j++) {
                const pointValueIsInTrace = aMatrix[j] && //is point exist in matrix
                    (aMatrix[j][i] === previousValue -1) && //check value of point to be prev - 1
                    aMatrix[j][i] !== 0 && //check if it is not enemy
                    !(i === x && j === y) && //check if it is not hero
                    !(i === x - 1 && j === y - 1) && //check if it is not diagonal point
                    !(i === x + 1 && j === y - 1) && //check if it is not diagonal point
                    !(i === x + 1 && j === y + 1) && //check if it is not diagonal point
                    !(i === x - 1 && j === y + 1) //check if it is not diagonal point
                const isEndOfTrace = successfulRoute.length === aMatrix[heroPosition.y - 1][heroPosition.x - 1] - 1;

                if (pointValueIsInTrace){
                    previousValue = aMatrix[j][i];
                    successfulRoute.push([i, j]);
                    x = i;
                    y = j;
                } else if (isEndOfTrace) {
                    x = enemyPos.x - 1;
                    y = enemyPos.y - 1;
                }
            }
        }
    }
    return successfulRoute.reverse(); // Reverse the array so it's at the start
}

export const generateMatrix = (enemyPos, blockedPoints, wallPositions) => {
    const tempMatrix = [];

    for(let i = 1; i <= constants.boardXSize; i++) {
        const row = [];

        for (let j = 1; j <= constants.boardYSize; j++) {
            const point = {x: j, y: i};

            if (isPointInBlockedPoints(blockedPoints, point) || isPointInBlockedPoints(wallPositions, point)) {
                row.push(-1);
            } else {
                row.push(0);
            }
        }
        tempMatrix.push(row);
    }
    return tempMatrix;
}


export const generatePositions = () => {
    const heroPos = generatePoint();
    const enemyPositions = [];
    while (enemyPositions.length < constants.enemyCount) {
        const enemyPos = generatePoint();
        const isPointFree = (!isPointInBlockedPoints(enemyPositions, enemyPos) || enemyPositions.length === 0) &&
            isNotEqualPoints(heroPos, enemyPos);

        if (isPointFree) {
            enemyPositions.push(enemyPos);
        }
    }

    const wallPositions = [];

    while (wallPositions.length < constants.wallCount) {
        const wallPos = generatePoint();
        const isPointFree = !isPointInBlockedPoints(enemyPositions, wallPos) &&
            isNotEqualPoints(heroPos, wallPos) &&
            (!isPointInBlockedPoints(wallPositions, wallPos) || wallPositions.length === 0);

        if (isPointFree) {
            wallPositions.push(wallPos);
        }
    }

    return {
        heroPosition: heroPos,
        enemyPositions,
        wallPositions
    }
}
