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

exports.getShiftData = (req, res) =>
{
    const membersData = req.body;
    const userId = req.params.userId;

    db.query('SELECT id, lastpick FROM user WHERE user_id=?', [userId], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const com_id = result[0].id;
            const lastpick = result[0].lastpick;
            const sql = "SELECT shift_tb.data, worktypes.worktypes FROM shift_tb LEFT JOIN worktypes ON shift_tb.com_id = worktypes.com_id WHERE shift_tb.com_id=?";
            db.query(sql, [com_id], (err, shiftData) =>
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
                    const shiftInfo = JSON.parse(shiftData[0].data);
                    const works = JSON.parse(shiftData[0].worktypes);
                    const data = shift.getData(shiftInfo, membersData, lastpick);
                    const picked = data[0];
                    const thisWeek = data[1];
                    res.json({
                        week: thisWeek,
                        work: works,
                        shift: picked
                    });
                }
            });
        }
    });
}