import {CHANGE_ENEMY_POSITIONS, CHANGE_HERO_POSITION, RESET_POSITIONS} from "../actionTypes";
import { generatePositions } from "../utils";

const initialState = generatePositions();

const positions = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_HERO_POSITION:
            return {
                ...state,
                heroPosition: action.position
            }
        case CHANGE_ENEMY_POSITIONS:
            return {
                ...state,
                enemyPositions: action.positions
            }
        case RESET_POSITIONS:
            return {
                ...state,
                heroPosition: action.positions.heroPosition,
                enemyPositions: action.positions.enemyPositions,
                wallPositions: action.positions.wallPositions
            }
        default: {
            return state;
        }
    }
};

export default positions;
