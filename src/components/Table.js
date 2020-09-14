import React from 'react';
import TableContainer from "../containers/TableContainer";
import Square from "./Square";
import Hero from "./Hero";
import PropTypes from "prop-types";
import GameOverModal from "./GameOverModal";

function Table(props) {

    return (
        <div className='wrapper'>
            <section className='board'>
                {
                    props.squares.map(square =>
                        <Square
                            isHero={square.x === props.heroPosition.x && square.y === props.heroPosition.y}
                            isEnemy={props.enemyPositions.some((pos) => {return pos.x === square.x && pos.y === square.y})}
                            isWall={props.wallPositions.some((pos) => {return pos.x === square.x && pos.y === square.y})}
                            key={`${square.x}${square.y}`}
                            x={square.x}
                            y={square.y}
                            isGameOver = {props.isGameOver}
                        />)
                }
            </section>
        </div>
    )

}
Table.propTypes = {
    heroPosition: PropTypes.object,
    enemyPositions: PropTypes.array,
    wallPositions: PropTypes.array,
    squares: PropTypes.array,
    isGameOver: PropTypes.bool,
}
export default Table;
