const shift = require('../public/main');
const mysql = require('mysql');

const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

exports.testPost = (req, res) =>
{
    const test = req.body;
    console.log(test);
    test.rows = "This is changed";
    res.json(test);
}

exports.getTableData = (req, res) =>
{
    const dataMembers = req.body;
    console.log(dataMembers);

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
                            const tableData = shift.getData(shiftScoreData, shiftOptionsData, dataMembers);
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
}