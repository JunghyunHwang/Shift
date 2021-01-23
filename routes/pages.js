const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dataController = require('../controllers/getdata');

router.get('/', (req, res) =>
{
    if(req.headers.cookie)
    {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        return res.render('index', 
        {
            isLogined: true,
            userId: userId
        });
    }
    else
    {
        res.render('index');
    }
});

router.post('/api/shift', dataController.getShiftData);

router.get('/user/:userId', (req, res) =>
{
    const userId = req.params.userId;
    res.render('personal', {user: userId});
});

router.get('/setting/shift', (req, res) =>
{
    res.render('setting');
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