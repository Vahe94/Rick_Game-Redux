import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";

function GameOverModal(props) {
    const isGameOver = useSelector(state => state.gameStatus.isGameOver);
    const score = useSelector(state => state.gameStatus.score);

    return (
        <Modal show={isGameOver} backdrop="static">
            <Modal.Header>
                <Modal.Title>Game is over</Modal.Title>
            </Modal.Header>
            <Modal.Body>Wubba lubba dub dub!! You did {score} steps!</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={props.startNewGame}>
                    Start New Game
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
GameOverModal.propTypes = {
    isGameOver: PropTypes.bool,
    score: PropTypes.number,
    startNewGame: PropTypes.func,
}
export default GameOverModal;
