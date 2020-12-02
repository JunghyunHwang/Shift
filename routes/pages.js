const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
    if(req.headers.cookie)
    {
        return res.render('index', 
        {
            button: true,
            isLogin: true
        });
    }
    else
    {
        res.render('index');
    }
});

router.get('/login', (req, res) =>
{
    res.render('login');
});

router.get('/signup', (req, res) =>
{
    res.render('signup');
});

module.exports = router;