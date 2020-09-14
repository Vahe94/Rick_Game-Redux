import React, {useCallback, useEffect, useState, useRef, useDebugValue} from 'react';
import Table from "../components/Table";
import GameOverModal from "../components/GameOverModal";


function TableContainer() 
{
    const [xSize, setXSize] = useState(8);
    const [ySize, setYSize] = useState(8);
    const [squares, setSquares] = useState([]);
    const [heroPosition, setHeroPosition] = useState({});
    const [enemyPositions, setEnemyPositions] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false );
    const [score, setScore] = useState(0 );
    const [wallPositions, setWallPositions] = useState([]);
    const firstHeroPos = useRef({});
    const isMounted = useRef(false);

    useEffect(() => 
    {
        drawBoard();
        generatePositions();
    }, [])

    useEffect(() => 
    {
        if(isMounted.current && !(firstHeroPos.current.x === heroPosition.x && firstHeroPos.current.y === heroPosition.y)){
            firstHeroPos.current = {x: 0, y: 0};
            calculateMinWay();
        }
        if( !isMounted.current ) 
        {
            isMounted.current = true;
        }
    }, [heroPosition])

    function startNewGame() {
        setScore(0);
        setIsGameOver(false);
        drawBoard();
        generatePositions();
    }

    function moveHero(event) 
    {
        if (event.keyCode === 37 && !isGameOver) 
        {
            if(heroPosition.x !== 1 && !wallPositions.some(pos => (pos.x === heroPosition.x - 1 && pos.y === heroPosition.y)))
            {
                setHeroPosition({x: heroPosition.x - 1, y: heroPosition.y});
                setScore(score+1);
            }
        }
        if (event.keyCode === 38 && !isGameOver) 
        {
            if(heroPosition.y !== 1 && !wallPositions.some(pos => (pos.x === heroPosition.x && pos.y === heroPosition.y - 1)))
            {
                setHeroPosition({x: heroPosition.x, y: heroPosition.y - 1});
                setScore(score+1);
            }
        }
        if (event.keyCode === 39 && !isGameOver) 
        {
            if(heroPosition.x !== xSize && !wallPositions.some(pos => (pos.x === heroPosition.x + 1 && pos.y === heroPosition.y)))
            {
                setHeroPosition({x: heroPosition.x + 1, y: heroPosition.y});
                setScore(score+1);
            }
        }
        if (event.keyCode === 40 && !isGameOver) 
        {
            if(heroPosition.y !== ySize && !wallPositions.some(pos => (pos.x === heroPosition.x && pos.y === heroPosition.y + 1)))
            {
                setHeroPosition({x: heroPosition.x, y: heroPosition.y + 1});
                setScore(score+1);
            }
        }
    }

    const generatePositions = useCallback(() => 
    {
        function generatePoint()
        {
            return {x: 1 + Math.floor(Math.random() * 8), y: 1 + Math.floor(Math.random() * 8)};
        }
        const heroPos = generatePoint();
        firstHeroPos.current = heroPos;
        setHeroPosition(heroPos);
        let enemyPoss = [];
        while (enemyPoss.length < 3)
        {
            const enemyPos = generatePoint();
            if ((!enemyPoss.find(pos => (pos.x === enemyPos.x && pos.y === enemyPos.y)) || enemyPoss.length === 0) && (heroPos.x !== enemyPos.x && heroPos.y !== enemyPos.y))
            {
                enemyPoss.push(enemyPos);
            }
        }
        let wallPoss = [];
        while (wallPoss.length < 10)
        {
            const wallPos = generatePoint();
            if (!enemyPoss.find(pos => (pos.x === wallPos.x && pos.y === wallPos.y)) && (heroPos.x !== wallPos.x && heroPos.y !== wallPos.y) && (!wallPoss.find(pos => (pos.x === wallPos.x && pos.y === wallPos.y)) || wallPoss.length === 0))
            {
                wallPoss.push(wallPos);
            }
        }
        setEnemyPositions(enemyPoss);
        setWallPositions(wallPoss);
    },[setHeroPosition, setEnemyPositions, setWallPositions]);

    const drawBoard = useCallback(() => 
    {
        let tempArr = [];
        for(let i = 0; i < xSize; i++) 
        {
            for (let j = 0; j < ySize; j++)
            {
                tempArr.push( {x: j + 1, y: i + 1} );
            }
        }
        setSquares(tempArr);
    }, [setSquares])


    const pathFinder = (aMatrix, enemyPos) => 
    {
        const toVisit = [[enemyPos.x - 1, enemyPos.y - 1]]; // Initialise at the start square

        while(toVisit.length) 
        { // While there are still squares to visit
            let x = toVisit[0][0];

            let y = toVisit[0][1];

            if (neighbourCheck(aMatrix, x-1,y, enemyPos)) 
            {
                aMatrix[y][x-1] = aMatrix[y][x] + 1;
                toVisit.push([x-1, y]);
            }
            if (neighbourCheck(aMatrix, x+1,y, enemyPos)) 
            {
                aMatrix[y][x+1] = aMatrix[y][x] + 1;
                toVisit.push([x+1, y]);
            }
            if (neighbourCheck(aMatrix, x,y-1, enemyPos)) 
            {
                aMatrix[y-1][x] = aMatrix[y][x] + 1;
                toVisit.push([x, y-1]);
            }
            if (neighbourCheck(aMatrix, x,y+1, enemyPos)) 
            {
                aMatrix[y+1][x] = aMatrix[y][x] + 1;
                toVisit.push([x, y+1]);
            }
            toVisit.shift();
        }

        const distance = aMatrix[heroPosition.y - 1][heroPosition.x - 1];
        return [aMatrix, distance];
    }

    const backtrace = (aMatrix, enemyPos) => 
    {

        let previousValue = aMatrix[heroPosition.y - 1][heroPosition.x - 1];
        const successfulRoute = [];

        let x = heroPosition.x - 1;
        let y = heroPosition.y - 1;

        while ( !(x === enemyPos.x - 1 && y === enemyPos.y - 1) ) 
        {
            for (let i = x-1; i < x+2; i++)  
            {  // -1, 0, 1
                for (let j = y-1; j < y+2; j++) 
                { // -1, 0, 1
                    if ( aMatrix[j] &&
                        (aMatrix[j][i] === previousValue -1) &&
                        aMatrix[j][i] !== 0 &&
                        !(i === x && j === y) &&
                        !(i === x - 1 && j === y - 1) &&
                        !(i === x + 1 && j === y - 1) &&
                        !(i === x + 1 && j === y + 1) &&
                        !(i === x - 1 && j === y + 1))
                    {
                        previousValue = aMatrix[j][i];
                        successfulRoute.push([i, j]);
                        x = i;
                        y = j;

                    } else if (successfulRoute.length === aMatrix[heroPosition.y - 1][heroPosition.x - 1] - 1) 
                    { // If we got to the end of the route
                        x = enemyPos.x - 1;
                        y = enemyPos.y - 1;
                    }

                }
            }

        }

        // successfulRoute.unshift([x2, y2]); // Add end point
        // successfulRoute.push([x1, y1]); // Add start point
        return successfulRoute.reverse(); // Reverse the array so it's at the start

    }

    const neighbourCheck = (aMatrix, x, y, pos) => 
    {
        return aMatrix[y] && (aMatrix[y][x] === 0) && !(x === pos.x - 1 && y === pos.y - 1);
    }


    const calculateMinWay = () => 
    {
        const newPositions = [];
        const blockedPoints = [];
        let gameOver = false;
        enemyPositions.forEach(enemyPos => 
        {
            if(!gameOver)
            {
                let stepsCount = -1;
                let checkedMatrix;
                let noMove = false;
                while (stepsCount <= 1) {
                    const aMatrix = generateMatrix(enemyPos, blockedPoints);
                    checkedMatrix = pathFinder(aMatrix, enemyPos);
                    stepsCount = checkedMatrix[1];
                    if((enemyPos.x === heroPosition.x && enemyPos.y === heroPosition.y) || stepsCount === 1) {
                        gameOver = true;
                        break;
                    }
                    if (stepsCount === 0) {
                        noMove = true;
                        stepsCount = 2;
                    }
                }
                if(!gameOver) 
                {
                    if (noMove) {
                        newPositions.push(enemyPos);
                        blockedPoints.push(enemyPos);
                    } else {
                        let trace = backtrace(checkedMatrix[0], enemyPos);
                        newPositions.push({x: trace[0][0] + 1, y: trace[0][1] + 1});
                        blockedPoints.push({x: trace[0][0] + 1, y: trace[0][1] + 1});
                    }
                }
            } else 
                {
                setIsGameOver(true);
            }

        })
        if(!gameOver) 
        {
            setEnemyPositions(newPositions);
        } else 
            {
                setIsGameOver(true);
        }
    }

    const generateMatrix = (enemyPos, blockedPoints) => 
    {
        const tempMatrix = [];
        for(let i = 1; i <= xSize; i++) 
        {
            const row = [];
            for (let j = 1; j <= ySize; j++) {
                if(blockedPoints.some((pos) => {return pos.x === j && pos.y === i}) || wallPositions.some((pos) => {return pos.x === j && pos.y === i})){
                    row.push(-1);
                } else {
                    row.push(0);
                }
            }
            tempMatrix.push(row);
        }
        return tempMatrix;
    }

    return (
        <div tabIndex="0" onKeyUp={moveHero}>
            <Table  squares={squares} heroPosition={heroPosition} enemyPositions={enemyPositions} wallPositions={wallPositions} isGameOver={isGameOver} />
            <GameOverModal isGameOver={isGameOver} score={score} startNewGame={startNewGame}/>
        </div>
    )
}

export default TableContainer;
