import React from 'react';
import Square from "./Square";
import PropTypes from "prop-types";

function Table(props) {

    return (
        <div className='wrapper' >
            <section className='board'>
                {
                    props.squares.map((square, i) =>
                        <Square
                            key={`${square.x}${square.y}`}
                            id={i}
                            x={square.x}
                            y={square.y}
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
