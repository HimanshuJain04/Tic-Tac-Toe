// import statements
// import dotenv from 'dotenv';
// dotenv.config();

import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import dotenv from "dotenv";
dotenv.config(
    {
        path: "./env"
    }
);

// quick variables
const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;


let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
let currentPlayer = "X";
let gameOver = false;



io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Send initial board state to the connected client
    socket.emit('initialBoard', board);

    // Handle move from client
    socket.on('move', ({ row, col }) => {
        if (!gameOver && board[row][col] === "") {
            board[row][col] = currentPlayer;
            io.emit('updateBoard', { board, currentPlayer });
            checkWinner();
            checkDraw();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    });

    // Handle reset request from client
    socket.on('reset', () => {
        resetGame();
        io.emit('initialBoard', board);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

function checkWinner() {
    // Check Horizontal, Vertical, and Diagonal Wins
    const lines = [
        [[0, 0], [0, 1], [0, 2]], // rows
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], // columns
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], // diagonals
        [[0, 2], [1, 1], [2, 0]],
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            io.emit('gameOver', { winner: board[a[0]][a[1]] });
            gameOver = true;
            return;
        }
    }
    // No winner, check for draw
    checkDraw();
}

function checkDraw() {
    // Check for Draw
    if (!board.flat().includes("")) {
        io.emit('gameOver', { draw: true });
        gameOver = true;
    }
}
function resetGame() {
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    currentPlayer = "X";
    gameOver = false;
}


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// listen
server.listen(PORT, () => {
    console.log("Server is listening on : ", PORT)
});


// default route;
app.get("/", (req, res) => {
    res.send("Default Route");
});

