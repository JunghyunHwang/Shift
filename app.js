const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const test = require('./public/test');
const { Script } = require('vm');

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

app.use('/api/:userId', (req, res) =>
{
    const userId = req.params.userId;
    db.query('SELECT id FROM user WHERE user_id=?', [userId], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const com_id = result[0].id;
            const shift_sql = 'SELECT data FROM shift_tb WHERE com_id=?';
            const shiftOptions_sql = 'SELECT data FROM shiftoptions WHERE com_id=?';
            db.query(shift_sql, [com_id], (err, shiftScore_row) =>
            {
                if(err)
                {
                    console.log(err);
                }/*
                else if(!shiftScore_row) // 아이디만 있고 근무 설정 하지 않음
                {

                }*/
                else
                {
                    db.query(shiftOptions_sql, [com_id], (err2, shiftOptions_row) =>
                    {
                        if(err2)
                        {
                            console.log(err2);
                        }
                        else
                        {
                            const shiftScoreData = JSON.parse(shiftScore_row[0].data);
                            const shiftOptionsData = JSON.parse(shiftOptions_row[0].data);
                            const tableData = test.getData(shiftScoreData, shiftOptionsData);
                            res.json({
                                headers: tableData.headers,
                                rows: tableData.rows
                            });
                        }
                    });
                }
            });
        }
    });
});

app.get('/user/:userId', (req, res) =>
{
    const userId = req.params.userId; // 이걸로 app.get('/api') middleware 만들어서 해봐!!!!!!!!!!!!
    res.render('personal',
    {
        script: userId
    });
});

app.listen(3000, () =>
{
    console.log("Server is running like Ninja");
});