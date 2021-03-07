const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }
);

exports.login = async (req, res) =>
{
    try 
    {
        const { USER_ID, USER_PASSWORD } = req.body;

        if(!USER_ID || !USER_PASSWORD)
        {
            return res.status(400).render('login', 
            {
                message: "아이디 또는 비밀번호를 입력해주세요."
            });
        }

        db.query('SELECT * FROM user WHERE user_id = ?', [USER_ID], async (error, results) =>
        {
            // id 값 틀리면 에러남
            if(!results.length || !(await bcrypt.compare(USER_PASSWORD, results[0].user_password)))
            {
                res.status(401).render('login', { message: "아이디 또는 비밀번호를 확인 해주세요."});
            }
            else
            {
                const ID = results[0].user_id;

                const TOKEN = jwt.sign({ id: ID }, process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                const COOKIE_OPTIONS = 
                {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('jwt', TOKEN, COOKIE_OPTIONS);
                res.status(200).redirect('/');
            }
        });
    } 
    catch (error) 
    {
        console.log(error);    
    }
}

exports.signup = (req, res) =>
{
    const{ USER_ID, COM_NAME, USER_PASSWORD, PASSWORD_CONFIRM } = req.body;

    db.query('SELECT user_id FROM user WHERE user_id = ?', [USER_ID], async (error, results) =>
    {
        if(error)
        {
            console.log(error);
        }

        if(results.length)
        {
            return res.render('signup', 
            {
                message: "이미 사용하고 있는 아이디 입니다."
            });
        }
        else if(USER_PASSWORD !== PASSWORD_CONFIRM)
        {
            return res.render('signup', 
            {
                message: "비밀번호가 일치하지 않습니다."
            });
        }

        let hashedPassword = await bcrypt.hash(USER_PASSWORD, 8);

        db.query('INSERT INTO user SET ?, created=NOW()', {user_id: USER_ID, com_name: COM_NAME, user_password: hashedPassword}, (error, results) =>
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                return res.render('login');
            }
        });
    });
}

module.exports.logout_get = (req, res) =>
{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
