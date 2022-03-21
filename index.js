// SERVER SET-UP

require('./models')
require('dotenv').config()
const express = require('express')
const cors = require('cors')                            // may be a good idea to disable this for deployment d/t security concerns

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(cors())
// app.use(express.urlencoded({ extended: false }));       // body parser middleware for post requests n such - only need for html forms
app.use(express.json())                                 // allows request bodies in json?

app.get('/', (req, res)=> {
    res.json({ msg: 'welcome to the user app 👋🏻' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users'))

app.listen(PORT, ()=> console.log(`listening to the smooth sounds of ${PORT} in the morning 🌊`))