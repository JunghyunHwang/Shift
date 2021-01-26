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
            const sql = "SELECT shift_info.types_shift, relation.relation FROM shift_info LEFT JOIN relation ON shift_info.com_id = relation.com_id WHERE shift_info.com_id = ?";
            
            db.query(sql, [com_id], (err, shiftData) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    const shiftInfo = 
                    {
                        typesOfShift: JSON.parse(shiftData[0].types_shift),
                        relation: null,
                        lastPick: lastPick
                    };

                    if(shiftData[0].relation !== null)
                    {
                        shiftInfo.relation = JSON.parse(shiftData[0].relation);
                    }
                    
                    const data = shift.getData(membersData, shiftInfo);
                    const pickedMember = data[0];
                    const thisWeek = data[1];
                    
                    res.json({
                        thisWeek: thisWeek,
                        typesOfShift: shiftInfo.typesOfShift,
                        shift: pickedMember
                    });
                }
            });
        }
    });
}