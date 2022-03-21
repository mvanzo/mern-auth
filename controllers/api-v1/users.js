const express = require('express')
const router = express.Router()

// POST /users/register -- CREATE  a new user
router.post('/register', async (req, res)=> {
    try{
        // check if the user exists already -- don't allow them to sign up again

        // hash the password (could validate if we wanted)

        // create a user in the db

        // create a jwt payload to send back to the client

        // sign the jwt and send it (log them in)
    } catch(err) {
        console.log(err)
        res.status(503).json({ msg: 'server error 503 🔥' })
    }
})

// POST /users/login -- validate login credentials
router.post('/login', (req, res)=> {
    res.send('sign a user in')
})

// GET /users/auth-locked -- example of chekcing a jwt and not serving data unless the jwt is valid
router.get('/auth-locked', (req, res)=> {
    res.send('validate a token')
})

module.exports = router