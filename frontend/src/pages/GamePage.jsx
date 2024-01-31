import React, { useEffect, useState } from 'react';


function GamePage() {

    const [flag, setFlag] = useState(false);

    const [board, setBoard] = useState(
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ]
    );

    useEffect(() => {
        // for getting the first chance 
        const num = Math.random();
        if (num > 0.5) {
            setFlag(true);
        } else {
            setFlag(false);
        }
    }, []);


    function clickHandler(i, j) {

        if (board[i][j] !== "") return;

        const valueOnBoard = flag ? "X" : "O";

        const copyBoard = [...board];
        copyBoard[i][j] = valueOnBoard;

        setBoard(copyBoard);
        setFlag(!flag);
    }


    function resetFunctionality() {
        const newBoard = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        setBoard(newBoard);

    }

    // Checking Winner
    useEffect(() => {
        // Check Horizontal Wins
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                alert(`${board[i][0]} is the winner!`);
                return;
            }
        }

        // Check Vertical Wins
        for (let j = 0; j < 3; j++) {
            if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
                alert(`${board[0][j]} is the winner!`);
                return;
            }
        }

        // Check Diagonal Wins
        if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            alert(`${board[0][0]} is the winner!`);
            return;
        }
        if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            alert(`${board[0][2]} is the winner!`);
            return;
        }

        // Check for Draw
        if (!board.flat().includes("")) {
            alert("It's a draw!");
        }
    }, [board]);



    return (
        <div className='flex justify-center items-center w-full h-[100vh]'>
            <div
                className=' bg-[white]/[0.15] p-2 rounded-md'
            >
                {
                    board.map((row, indexi) => (
                        <div
                            className='flex'
                        >
                            {
                                row.map((box, indexj) => (
                                    <div className='flex flex-col p-2'>
                                        <button
                                            onClick={() => clickHandler(indexi, indexj)}
                                            className='w-[100px] flex text-white text-xl justify-center items-center h-[100px] rounded-lg bg-black'
                                        >
                                            <span className=''>
                                                {
                                                    box === "" ? "" : box
                                                }
                                            </span>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default GamePage
