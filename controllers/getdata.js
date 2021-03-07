const DRAW = require('../public/main');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const DB = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

exports.getShiftData = (req, res) =>
{
    const INPUT_DATA = req.body;
    const TOKEN = req.cookies.jwt;
    const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
    const USER_ID = DECODED.id;

    DB.query('SELECT id, last_draw FROM user WHERE user_id=?', [USER_ID], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const COM_ID = result[0].id;
            const LAST_DRAW = result[0].last_draw;
            const WORK_INFO_SQL = "SELECT is_weekday, work_name, num_of_work, first_work_time, time_interval, is_duo FROM shift_info WHERE com_id=?";
            
            DB.query(WORK_INFO_SQL, [COM_ID], (err, workData) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    /*
                    if(workData.length === 0)
                    {
                        console.log("Hi");
                        return res.render('setting');
                    }
                    */
                    let workInfo = {};
                    workInfo.weekday = [];
                    workInfo.weekend = [];

                    for(const work of workData)
                    {
                        let tempData = {
                            workName: work.work_name,
                            num: work.num_of_work,
                            firstWorkTime: work.first_work_time,
                            timeInterval: work.time_interval,
                            duo: work.is_duo
                        };

                        if(work.is_weekday) // weekday
                        {
                            workInfo.weekday.push(tempData);
                        }
                        else // weekend
                        {
                            workInfo.weekend.push(tempData);
                        }
                    }
                    
                    const SHIFT_INFO = 
                    {
                        work_info: workInfo,
                        relation: null,
                        lastDraw: LAST_DRAW
                    };
                    const RELATION_SQL = "SELECT relation_info FROM relation WHERE com_id=?";

                    DB.query(RELATION_SQL, [COM_ID], (err, relation) =>
                    {
                        if(relation[0] !== undefined)
                        {
                            SHIFT_INFO.relation = JSON.parse(relation[0].relation_info);
                        }

                        // Send data
                        const DATA = DRAW.getData(INPUT_DATA, SHIFT_INFO);
                        const SHIFT = DATA[0];
                        const THISWEEK = DATA[1];
                        const MEMBERS_DATA = DATA[2];

                        res.json({
                            thisWeek: THISWEEK,
                            work_info: SHIFT_INFO.work_info,
                            shift: SHIFT
                        });

                        const INPUT_MEMBERS_SQL = "INSERT INTO members SET ?";

                        for(let member of MEMBERS_DATA)
                        {
                            const WORKED = JSON.stringify(member.worked);
                            DB.query(INPUT_MEMBERS_SQL,
                            {name: member.name, last_working_day: member.date, worked: WORKED, com_id: COM_ID},
                            (errMemberInput, memberInput) =>
                            {
                                if(errMemberInput)
                                {
                                    console.log(errMemberInput);
                                }
                                else
                                {
                                    console.log("good");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}