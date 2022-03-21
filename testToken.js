const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtTest = async () => {
    try {
        // simulate a server response when a user is logged in
        // create a jwt payload (data that is bundled into a jwt)
        const payload = {
            name: "Hi I am a user",
            id: 'jksdkj',
            // password?? NO DEFINTELY NOT-VERY INSECURE, but any other public user data is fine
            email: 'email@domain.com'
        }

        // sign the jwt
        // 1. payload 2. secret string (like a password) 3. length of time in minutes that the token is good for (thinking banking app log out after a period time)
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: (60 * 60) * 24 })
        console.log(token)
        
        // decode the jwt
        // jwt verify - will make sure that the secret in the jwt is the same as our server's secret
        // pass in 1. token 2. secret
        // this is where you need the catch(err) part of the function - to catch if the secret string is incorrect
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
    } catch(err) {
        console.log(err)
    }
}

jwtTest()