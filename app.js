const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const test = require('./public/test');

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

app.get('/api')

app.get('/user/:userName', (req, res) =>
{
    const userName = req.params.userName;
    console.log(userName);

    db.query('SELECT id FROM user WHERE user_id=?', [userName], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const com_id = result[0].id;
            const sql = 'SELECT day_of, shift_name FROM shift WHERE com_id=?';
            db.query(sql, [com_id], (err, row) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    const dataTest = test.getData(row);
                    console.log(dataTest);
                }
            })
        }
    });
    res.render('personal');
});

app.listen(3001, () =>
{
    console.log("Server is running like Ninja");
});