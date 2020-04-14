const express = require('express')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
const app = express()
app.use(express.json())

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))


massive({
    connectionString: CONNECTION_STRING,
    ssl:{
        rejectUnauthorized: false
    }
}).then(db => {
    console.log(`DB IS CONNECTED`)
    app.set('db', db)
}).catch(err => console.log(`error in db ${err}`))


app.post('/auth/register', authCtrl.register)


app.listen(SERVER_PORT, ()=> console.log(`DOCKED AT PORT ${SERVER_PORT}`))

