const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const app = express();

dotenv.config({path: './.env'});

// Database connect
/*
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

db.connect((error) =>
{
    if(error)
    {
        console.log(error);
    }
});
*/

app.use(express.static('public'));

app.get('/data', (req, res) =>
{
    res.json();
});

app.listen(3001, () =>
{
    console.log("Server started on Port 3001");
});