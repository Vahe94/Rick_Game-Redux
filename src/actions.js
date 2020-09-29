import {CHANGE_HERO_POSITION, CHANGE_ENEMY_POSITIONS, CHANGE_SCORE, CHANGE_GAME_STATUS, RESET_POSITIONS, RESET_GAME_STATUS} from "./actionTypes"
import {backtrace, generateMatrix, generatePositions, isEqualPoints, pathFinder} from "./utils";

export const changeHeroPosition = position => ({
    type: CHANGE_HERO_POSITION,
    position
})

export const resetPositions = () => ({
    type: RESET_POSITIONS,
    positions: generatePositions()
})


export const resetGameStatus = () => ({
    type: RESET_GAME_STATUS
})

export const changeScore = () => ({type: CHANGE_SCORE});

export const changeEnemyPositions = (heroPosition, positions, dispatch) => {
    const newPositions = [];
    const blockedPoints = [];
    let gameOver = false;
    for (let i = 0; i < positions.enemyPositions.length; i++) {
        const enemyPos = positions.enemyPositions[i];
        if (!gameOver) {
            let stepsCount = -1;
            let checkedMatrix;
            let noMove = false;

            while (stepsCount <= 1) {
                const aMatrix = generateMatrix(enemyPos, blockedPoints, positions.wallPositions);
                checkedMatrix = pathFinder(aMatrix, enemyPos, heroPosition);
                stepsCount = checkedMatrix[1];
                if (isEqualPoints(enemyPos, heroPosition) || stepsCount === 1) {
                    gameOver = true;
                    break;
                }
                if (stepsCount === 0) {
                    noMove = true;
                    stepsCount = 2;
                }
            }
            if (!gameOver) {
                if (noMove) {
                    newPositions.push(enemyPos);
                    blockedPoints.push(enemyPos);
                } else {
                    let trace = backtrace(checkedMatrix[0], enemyPos, heroPosition);
                    newPositions.push({x: trace[0][0] + 1, y: trace[0][1] + 1});
                    blockedPoints.push({x: trace[0][0] + 1, y: trace[0][1] + 1});
                }
            } else {
                return {
                    type: CHANGE_GAME_STATUS,
                    isGameOver: true
                }
            }
        }
    }
    if(!gameOver){
        return {
            type: CHANGE_ENEMY_POSITIONS,
            positions: newPositions
        }
    } else {
        return {
            type: CHANGE_GAME_STATUS,
            isGameOver: true
        }
    }
}
