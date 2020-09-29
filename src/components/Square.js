import React from 'react';
import Hero from "./Hero";
import Enemy from "./Enemy";
import Wall from "./Wall";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { canMove } from "../utils";
import * as constants from "../constants";
import { changeEnemyPositions, changeHeroPosition, changeScore } from "../actions";

function Square(props) {
    const dispatch = useDispatch();
    const heroPosition = useSelector(state => state.positions.heroPosition);
    const enemyPositions = useSelector(state => state.positions.enemyPositions);
    const wallPositions = useSelector(state => state.positions.wallPositions);
    const positions = useSelector(state => state.positions);
    const isGameOver = useSelector(state => state.gameStatus.isGameOver);

    function moveHero(event) {
        if (!isGameOver) {
            const allowedMove = canMove(heroPosition, wallPositions, constants.codeDirectionKeys[event.keyCode]);

            switch (event.keyCode) {
                case constants.leftArrowCode:
                    if (allowedMove) {
                        const nextPos = {x: heroPosition.x - 1, y: heroPosition.y};
                        dispatch(changeScore());
                        dispatch(changeHeroPosition(nextPos));
                        dispatch(changeEnemyPositions(nextPos, positions, dispatch));
                    }
                    break;
                case constants.upArrowCode:
                    if (allowedMove) {
                        const nextPos = {x: heroPosition.x, y: heroPosition.y - 1};
                        dispatch(changeScore());
                        dispatch(changeHeroPosition(nextPos));
                        dispatch(changeEnemyPositions(nextPos, positions, dispatch));
                    }
                    break;
                case constants.rightArrowCode:
                    if (allowedMove) {
                        const nextPos = {x: heroPosition.x + 1, y: heroPosition.y};
                        dispatch(changeScore());
                        dispatch(changeHeroPosition(nextPos));
                        dispatch(changeEnemyPositions(nextPos, positions, dispatch));
                    }
                    break;
                case constants.downArrowCode:
                    if (allowedMove) {
                        const nextPos = {x: heroPosition.x, y: heroPosition.y + 1};
                        dispatch(changeScore());
                        dispatch(changeHeroPosition(nextPos));
                        dispatch(changeEnemyPositions(nextPos, positions, dispatch));
                    }
                    break;
                default:
                    return;
            }
        }
    }

    return (
        <div tabIndex={props.id} onKeyUp={moveHero} id={`${props.x}${props.y}`} className='square'>
            { props.x === heroPosition.x && props.y === heroPosition.y && !props.isGameOver ? <Hero isGameOver={`${props.isGameOver}`}/> : null}
            { enemyPositions.some((pos) => {return pos.x === props.x && pos.y === props.y}) ? <Enemy/> : null}
            { wallPositions.some((pos) => {return pos.x === props.x && pos.y === props.y}) ? <Wall/> : null}
        </div>
    );
}

Square.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    isHero: PropTypes.bool,
    isEnemy: PropTypes.bool,
    isWall: PropTypes.bool,
    isGameOver: PropTypes.bool,
}
export default Square;
