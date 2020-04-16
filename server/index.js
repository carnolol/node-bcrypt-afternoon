const express = require('express')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const app = express()
const auth = require('./middleware/authMiddleware')
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

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.get('/api/treasure/all', auth.adminsOnly, treasureCtrl.getAllTreasure)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/auth/logout', authCtrl.logout)
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)


app.listen(SERVER_PORT, ()=> console.log(`DOCKED AT PORT ${SERVER_PORT}`))

