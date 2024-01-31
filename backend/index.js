// import statements
// import dotenv from 'dotenv';
// dotenv.config();

import express from "express";

import dotenv from "dotenv";
dotenv.config(
    {
        path: "./env"
    }
);

// quick variables
const app = express();
const PORT = process.env.PORT || 5000;



// listen
app.listen(PORT, () => {
    console.log("Server is listening on : ", PORT)
});

// default route;
app.get("/", (req, res) => {
    res.send("Default Route");
});