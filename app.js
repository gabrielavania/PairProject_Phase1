const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const route = require('./routes/route')

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use((req, res, next) => {
    res.locals.username = req.session.username
    res.locals.userId = req.session.userId
    next()
})
app.use(express.static('public'));

app.use(route)


app.listen(port, () => {
    console.log(`Connected to http://localhost:${port}`);
})

