const express = require('express')
const Controller = require('../controllers/controller')
const route = express.Router()

//Landing Page
route.get("/", Controller.showHome)
//Login - Register

route.get("/login", Controller.showLogin)
route.post("/login", Controller.actualLogin)
route.get("/register", Controller.showRegister)
route.post("/register", Controller.actualRegister)

//Profile Page


//Forum Stuff



module.exports = route