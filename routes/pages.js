const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dataController = require('../controllers/getData');
const fetch = require("node-fetch");

router.get('/', (req, res) =>
{
    if(req.headers.cookie)
    {
        const TOKEN = req.cookies.jwt;
        const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
        const USER_ID = DECODED.id;
        
        return res.render('index', {isLogined: true, userId: USER_ID});
    }
    else
    {
        res.render('index');
    }
});

router.post('/api/pick/shift', dataController.pickMember);

router.get('/api/get/shift', dataController.getShiftData);

router.get('/my_shift', (req, res) =>
{
    if(req.headers.cookie)
    {
        const TOKEN = req.cookies.jwt;
        const DECODED = jwt.verify(TOKEN, process.env.JWT_SECRET);
        const USER_ID = DECODED.id;

        return res.render('my_shift', 
        {
            isLogined: true,
            userId: USER_ID
        });
    }
    else
    {
        res.render('index');
    }
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