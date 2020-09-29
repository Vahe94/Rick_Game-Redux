import {CHANGE_SCORE, CHANGE_GAME_STATUS, RESET_GAME_STATUS} from "../actionTypes";

const initialState = {
    isGameOver: false,
    score: 0
};

const gameStatus = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_SCORE:
            return {
                ...state,
                score: ++state.score
            }
        case CHANGE_GAME_STATUS:
            return {
                ...state,
                isGameOver: action.isGameOver
            }
        case RESET_GAME_STATUS:
            return {
                ...state,
                isGameOver: false,
                score: 0
            }
        default: {
            return state;
        }
    }
};

export default gameStatus;
