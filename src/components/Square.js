import React from 'react';
import Hero from "./Hero";
import Enemy from "./Enemy";
import Wall from "./Wall";
import PropTypes from "prop-types";
import GameOverModal from "./GameOverModal";

function Square(props) {
    return (
        <div id={`${props.x}${props.y}`} className='square'>
            { props.isHero && !props.isGameOver ? <Hero isGameOver={`${props.isGameOver}`}/> : null}
            { props.isEnemy  ? <Enemy/> : null}
            { props.isWall ? <Wall/> : null}
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
