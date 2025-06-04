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
route.get("/logout",Controller.logOut)

//Dashboard
route.get("/dashboard", Controller.userDasboard)
route.get("/post/:id", Controller.detailPost)


//Profile Page
// route.get("/:id/profile", Controller.X)
// route.get("/:id/profile/edit", Controller.X)
// route.post("/:id/profile/edit", Controller.X)



//Post



module.exports = route