const express = require('express');
const router = express.Router();
const dataController = require('../controllers/getdata');

router.get('/', (req, res) =>
{
    if(req.headers.cookie)
    {
        return res.render('index', 
        {
            isLogin: true
        });
    }
    else
    {
        res.render('index');
    }
});

router.post('/api/:userId', dataController.getTableData);

router.get('/user/:userId', (req, res) =>
{
    const userId = req.params.userId;
    res.render('personal',
    {
        script: userId
    });
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