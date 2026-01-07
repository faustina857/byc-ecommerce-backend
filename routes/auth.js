const {User, validateLogin} = require('../models/user')
const express = require('express')
const router = express.Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')


router.post('/', async(req, res) => {
const { error } = validateLogin(req.body); 
if (error) return res.status(400).send(error.details[0].message);

let user = await User.findOne({ email: req.body.email });
if (!user) return res.status(400).send('invalid email or password.');

const validPassword = await bcrypt.compare(req.body.password, user.password);
if (!validPassword) return res.status(400).json({
    status: 'failed',
    message: 'invalid Email or Password'
});

    const token = user.generateAuthToken();
    res.send({
        token: token,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
})




module.exports = router