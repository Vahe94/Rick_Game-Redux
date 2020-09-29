import { combineReducers } from "redux";
import positions from "./positions";
import gameStatus from "./gameStatus";

export default combineReducers({positions, gameStatus});
