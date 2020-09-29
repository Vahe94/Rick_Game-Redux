import React, { useCallback, useEffect, useState } from 'react';
import Table from "../components/Table";
import GameOverModal from "../components/GameOverModal";
import { useDispatch } from 'react-redux'
import { resetGameStatus, resetPositions } from "../actions"
import { generateBoard } from "../utils";

function TableContainer() {
    const dispatch = useDispatch()
    const [squares, setSquares] = useState([]);

    function startNewGame() {
        drawBoard();
        dispatch(resetPositions());
        dispatch(resetGameStatus());
    }

    const drawBoard = useCallback(() => {
        const board = generateBoard();
        setSquares(board);
    }, [setSquares])

    useEffect(() => {
        drawBoard();
        // generatePositions();
    }, [drawBoard])

    return (
        <div>
            <Table squares={squares}/>
            <GameOverModal startNewGame={startNewGame}/>
        </div>
    )
}

export default TableContainer;
