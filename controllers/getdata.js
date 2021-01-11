const shift = require('../public/main');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

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
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    db.query('SELECT id, lastpick FROM user WHERE user_id=?', [userId], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const com_id = result[0].id;
            const lastPick = result[0].lastpick;
            const sql = "SELECT shift_tb.data, shift_tb.shift_type, worktypes.worktypes FROM shift_tb LEFT JOIN worktypes ON shift_tb.com_id = worktypes.com_id WHERE shift_tb.com_id=?";
            
            db.query(sql, [com_id], (err, shiftData) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    const shiftInfo = JSON.parse(shiftData[0].data);
                    const shiftType = JSON.parse(shiftData[0].shift_type);
                    const works = JSON.parse(shiftData[0].worktypes);
                    
                    const data = shift.getData(membersData, shiftInfo, shiftType, lastPick);
                    const pickedMember = data[0];
                    const thisWeek = data[1];
                    
                    res.json({
                        thisWeek: thisWeek,
                        workTypes: works,
                        shift: pickedMember
                    });
                }
            });
        }
    });
}