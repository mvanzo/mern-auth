const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../models')
const requiresToken = require('../requiresToken')
// const user = require('../../models/user')  ... I believe this was auto-imported, don't need it though

// POST /users/register -- CREATE  a new user
router.post('/register', async (req, res)=> {
    try{
        // check if the user exists already -- don't allow them to sign up again
        const userCheck = await db.User.findOne({
            email: req.body.email
        })

        if (userCheck) return res.status(409).json({ msg: 'did you forget that you already signed up with that email?' })

        // hash the password (could validate if we wanted)
        const salt = 12
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // create a user in the db
        const newUser = await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // create a jwt payload to send back to the client
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }

        // sign the jwt and send it (log them in)
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        res.json({ token })

    } catch(err) {
        console.log(err)
        res.status(503).json({ msg: 'server error 503 🔥' })
    }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res)=> {
    try {
        // try to find the user in the db that is logging in
        const foundUser = await db.User.findOne({
            email: req.body.email
        })
        // if the user is not found send -- return and send back a message that the user needs to sign up
        if (!foundUser) return res.status(400).json({ msg: 'bad login credentials 😢' })

        // check the password from the req.body again and the password in the db
        const checkPassword = await bcrypt.compare(req.body.password, foundUser.password)
        
        // if the provided info doesn't match -- send back an error message and return
        if (!checkPassword) return res.status(400).json({ msg: 'bad login credentials 😢' })

        // create a jwt payload
        const payload = {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser.id
        }
    
        // sign the jwt
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60*60 })
        console.log(token)
    
        // send the jwt back
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        res.json({token, decode})
    }
    catch (err) {
        console.log(err)
    }
})

// GET /users/auth-locked -- example of chekcing a jwt and not serving data unless the jwt is valid
router.get('/auth-locked', requiresToken, (req, res)=> {
    // here we have access to the user on the res.locals
    console.log('logged in user', res.locals.user)
    res.json({ msg: 'welcome to the auth locked route' })
})

module.exports = router