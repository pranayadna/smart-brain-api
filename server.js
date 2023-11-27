const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')

const register = require('./controllers/register')
const signIn = require('./controllers/sign-in')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const { defaults } = require('pg')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: 'postgresql://postgres4:mypostgres4@database-1.c5hahmzbtmr4.ap-southeast-1.rds.amazonaws.com/myDatabase',
        ssl: {
            rejectUnauthorized: false
        }
    }
});

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('it is working')
})

app.post('/signin', (req, res) => { signIn.signInHandler(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.registerHandler(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.getProfileHandler(req, res, db) })

app.put('/image', (req, res) => { image.imageHandler(req, res, db) })

app.post('/imageUrl', (req, res) => { image.apiCallHandler(req, res) })


app.listen(port, () => {
    if (port === 3000) {
        console.log(`app is running on port 3000`);
    } else {
        console.log(`app is running on port ${process.env.PORT}`);
    }
})

export default app