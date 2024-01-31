// import statements
// import dotenv from 'dotenv';
// dotenv.config();

import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"

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


io.on('connection', (socket) => {
    console.log('a user connected');
});

// listen
server.listen(PORT, () => {
    console.log("Server is listening on : ", PORT)
});


// default route;
app.get("/", (req, res) => {
    res.send("Default Route");
});

