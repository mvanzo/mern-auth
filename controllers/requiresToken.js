// CUSTOM MIDDLEWARE to require token

const jwt = require('jsonwebtoken')
const db = require('../models')

async function requiresToken(req, res, next) {
    try {
        // get token from the client
        const token = req.headers.authorization             // pulling from here because we placed the id in the authorization in the headers of postman
        
        // verify the token -- if not verified, will wind up in catch
        const decoded = jwt.verify(token, process.env.JWT_SECRET)       // this pulls from the payload that was created for this user
        console.log(decoded)

        // find the user from the data in the token
        const foundUser = await db.User.findById(decoded.id)

        // mount the user on the response ofr the next middleware/route
        res.locals.user = foundUser

        // invoke next to go to the next middleware function
        next()
    } catch(err) {
        // if we are down here -- authentication has failed
        console.log(err)
        res.status(401).json({ msg: "access is unauthorized" })
    }
}

module.exports = requiresToken