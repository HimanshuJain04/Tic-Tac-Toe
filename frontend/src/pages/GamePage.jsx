import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function GamePage() {
    const [board, setBoard] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [gameOver, setGameOver] = useState(false);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newSocket = socketIOClient('/');

        newSocket.on('initialBoard', initialBoard => {
            setBoard(initialBoard);
        });

        newSocket.on('updateBoard', ({ board, currentPlayer }) => {
            setBoard(board);
            setCurrentPlayer(currentPlayer);
        });

        newSocket.on('gameOver', ({ winner, draw }) => {
            if (winner) {
                setMessage(`Player ${winner} wins!`);
            } else if (draw) {
                setMessage("It's a draw!");
            }
            setGameOver(true);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
            setMessage('Socket error occurred');
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const clickHandler = (i, j) => {
        if (!gameOver && board[i][j] === "") {
            socket.emit('move', { row: i, col: j });
        }
    };

    const resetGame = () => {
        setGameOver(false);
        setMessage('');
        socket.emit('reset');
    };

    return (
        <div className='flex justify-center flex-col gap-10 items-center w-full h-[100vh]'>
            {message && <div className="message">{message}</div>}
            <div className='bg-[white]/[0.15] p-2 rounded-md'>
                {board.map((row, i) => (
                    <div key={i} className='flex'>
                        {row.map((col, j) => (
                            <div key={`${i}-${j}`} className='flex flex-col p-2'>
                                <button
                                    onClick={() => clickHandler(i, j)}
                                    disabled={col !== "" || gameOver}
                                    className={`w-[100px] text-white flex text-2xl font-bold justify-center items-center h-[100px] rounded-lg bg-black `}
                                >
                                    <span>{col}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className='bg-[white]/[0.15] px-10 py-2 rounded-md text-[white]/[0.7] font-semibold'>
                <p>Turn: {currentPlayer === "X" ? "Player 1" : "Player 2"}</p>
                {gameOver && (
                    <button onClick={resetGame} className='mt-2 px-4 py-2 bg-[white]/[0.15] text-[white]/[0.7] rounded-md font-semibold'>
                        Reset Game
                    </button>
                )}
            </div>
        </div>
    );
}

export default GamePage;
