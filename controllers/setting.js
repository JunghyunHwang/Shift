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
    const shift = JSON.parse(req.body.shift_info);
    const shiftInfo = JSON.stringify(shift.shift_info);
    let tempRelation;

    if(shift.relation_info === null)
    {
        tempRelation = null;
    }
    else
    {
        tempRelation = JSON.stringify(shift.relation_info);
    }

    const relationInfo = tempRelation;
    const token = req.cookies.jwt;

    // token cookie 값 없을때 처리
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // re .env JWT_SECRET 내용 바꾸기
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
            const sql = 'INSERT INTO shift_info SET ?, created=NOW()';

            db.query(sql, {types_shift: shiftInfo, com_id: com_id}, (errShift, results) =>
            {
                if(errShift)
                {
                    console.log(errShift);
                    // re 근무설정에 문제가 생겼습니다. 계속 이 현상이 나타나면 관리자에게 문의 해주세요.
                }
                else
                {
                    if(relationInfo !== null)
                    {
                        const workTypesSQL = 'INSERT INTO relation SET ?, created=NOW()';
                        db.query(workTypesSQL, {relation: relationInfo, com_id: com_id}, (errRel, result2) => // re change name result2
                        {
                            if(errRel)
                            {
                                console.log(errRel);
                            }
                            else
                            {
                                console.log("Good job");
                                res.status(200).redirect(`/`);
                            }
                        });
                    }
                    else
                    {
                        res.status(200).redirect(`/`);
                    }
                }
            });
        }
    });
}
