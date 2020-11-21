const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();


dotenv.config({path: './.env'});

// Database connect
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3001, () =>
{
    console.log("Server started on Port 3001");
});