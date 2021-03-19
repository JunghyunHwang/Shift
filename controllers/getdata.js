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

exports.getMyShiftData = (req, res) =>
{
    const TOKEN = req.cookies.jwt;
    const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
    const USER_ID = DECODED.id;
    const SHIFT_DATA_SQL = "SELECT last_week, this_week FROM shift WHERE com_id=?";

    DB.query('SELECT id FROM user WHERE user_id=?', [USER_ID], (err, result) =>
    {
        let comId = result[0].id;

        DB.query(SHIFT_DATA_SQL, [comId], (err, result) =>
        {
            if(err)
            {
                console.log(err);
            }
            else if(!result.length)
            {
                res.json({
                    status: false
                });
            }
            else
            {
                res.json({
                    status: true,
                    lastWeek: result[0].last_week,
                    thisWeek: result[0].this_week
                });
            }
        });
    });
}

exports.pickMember = (req, res) =>
{
    function saveShiftData(shiftData, comId)
    {
        const GET_SHIFT_SQL = "SELECT this_week FROM shift WHERE com_id=?";
        const INPUT_SHIFT_SQL = "INSERT INTO shift SET ?, created=NOW()";
        const UPDATE_SHIFT_SQL = "UPDATE shift SET last_week=?, this_week=?, created=NOW() WHERE com_id=?"
        let thisWeekShift = JSON.stringify(shiftData);

        DB.query(GET_SHIFT_SQL, [comId], (err, result) =>
        {
            if(err)
            {
                console.log(err);
            }
            else if(!result.length)
            {
                DB.query(INPUT_SHIFT_SQL, {this_week: thisWeekShift, com_id: comId}, (err, inputShift) =>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }
            else
            {
                let lastWeekShift = result[0].this_week;

                DB.query(UPDATE_SHIFT_SQL, [lastWeekShift, thisWeekShift, comId], (err, updateShift) =>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                });
            }
        });
    }

    function saveMemberData(membersData, comId)
    {
        const INPUT_MEMBERS_SQL = "INSERT INTO members SET ?";
        const UPDATE_MEMBERS_SQL = "UPDATE members SET total_count=?, last_working_day=?, worked=? WHERE id=?";
        
        // Make function members data insert into members table
        for(let member of membersData)
        {
            const TOTAL_COUNT = member.worked.length;
            const WORKED = JSON.stringify(member.worked);
            const HAS_MEMBER_SQL = "SELECT id, name, com_id FROM members WHERE name=? AND com_id=?";

            DB.query(HAS_MEMBER_SQL, [member.name, comId], (err, hasMember) =>
            {
                if(err)
                {
                    console.log(err);
                }
                else if(hasMember.length)
                {
                    DB.query(UPDATE_MEMBERS_SQL, [TOTAL_COUNT, member.date, WORKED, hasMember[0].id], (errUpdate, updateResult) =>
                    {
                        if(errUpdate)
                        {
                            console.log(updateErr);
                        }
                    });
                }
                else
                {
                    DB.query(INPUT_MEMBERS_SQL,
                    {name: member.name, total_count: TOTAL_COUNT, last_working_day: member.date, worked: WORKED, com_id: comId},
                    (errMemberInput, memberInput) =>
                    {
                        if(errMemberInput)
                        {
                            console.log(errMemberInput);
                        }
                    });
                }
            });
        }
    }

    function saveLastDrawDate(lastDraw, comId)
    {
        DB.query("UPDATE user SET last_draw=? WHERE id=?", [lastDraw, comId], (err, result) =>
        {
            if(err)
            {
                console.log(err);
            }
        });
    }

    const INPUT_DATA = req.body;
    const TOKEN = req.cookies.jwt;
    const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
    const USER_ID = DECODED.id;

    DB.query("SELECT id, last_draw FROM user WHERE user_id=?", [USER_ID], (err, result) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            const COM_ID = result[0].id;
            const LAST_DRAW = result[0].last_draw;
            const WORK_INFO_SQL = "SELECT is_weekday, work_name, num_of_work, first_work_time, time_interval, is_duo FROM work_info WHERE com_id=?";
            const MEMBERS_SQL = "SELECT name, total_count, last_working_day, worked FROM members WHERE com_id=?";

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
                        if(err)
                        {
                            console.log(err);
                        }
                        else if(relation[0] !== undefined)
                        {
                            SHIFT_INFO.relation = JSON.parse(relation[0].relation_info);
                        }

                        DB.query(MEMBERS_SQL, [COM_ID], (err, memberData) =>
                        {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                for(let person of INPUT_DATA)
                                {
                                    let index = memberData.findIndex(member => member.name === person.이름);
                                    // 만야 인덱스가 두개면 계급으로?
                                    
                                    if(index >= 0)
                                    {
                                        person.date = memberData[index].last_working_day;
                                        person.worked = JSON.parse(memberData[index].worked);
                                    }
                                    else
                                    {
                                        person.date = "0";
                                        person.worked = [];
                                    }
                                }

                                // Send data
                                const DATA = DRAW.draw_member(INPUT_DATA, SHIFT_INFO);
                                const SHIFT = DATA.shift_data;
                                const THISWEEK = DATA.week
                                const MEMBERS_DATA = DATA.members_data;
                                
                                
                                res.json({
                                    shift: SHIFT,
                                    thisWeek: THISWEEK,
                                    work_info: SHIFT_INFO.work_info
                                });
                                
                                saveShiftData(SHIFT, COM_ID);
                                // saveMemberData(MEMBERS_DATA, COM_ID);
                                // saveLastDrawDate(THISWEEK[6].date, COM_ID);
                            }
                        });
                    });
                }
            });
        }
    });
}