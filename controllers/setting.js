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

exports.shiftSetting = (req, res) =>
{
    const shiftInfo = JSON.parse(req.body.shift_info);
    const workTypes = JSON.stringify(shiftInfo.shiftTypes);
    const shiftType = JSON.parse(shiftInfo.Type);
    const shift = JSON.stringify(shiftInfo.shift_info);
    const token = req.cookies.jwt;

    // cookie 값 없을때 처리
    /*
    if()
    {

    }
    else
    {

    }
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    db.query('SELECT id FROM user WHERE user_id=?', [userId], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const com_id = result[0].id;
            const sql = 'INSERT INTO shift_tb SET ?, created=NOW()';

            db.query(sql, {data: shift, shift_type: shiftType, com_id: com_id}, (errShift, results) =>
            {
                if(errShift)
                {
                    console.log(errShift);
                    // re 근무설정에 문제가 생겼습니다. 계속 이 현상이 나타나면 관리자에게 문의 해주세요.
                }
                else
                {
                    const workTypesSQL = 'INSERT INTO worktypes SET ?, created=NOW()';
                    db.query(workTypesSQL, {worktypes: workTypes, com_id: com_id}, (errworkTypes, result2) => // re change name result2
                    {
                        if(errworkTypes)
                        {
                            console.log(errworkTypes);
                        }
                        else
                        {
                            console.log("Good job");
                            res.status(200).redirect(`/user/${userId}`);
                        }
                    });
                }
            });
        }
    });
}
