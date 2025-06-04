const express = require('express')
const Controller = require('../controllers/controller')
const { loginCheck } = require('../middlewares/loginCheck')
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
route.get("/dashboard",loginCheck, Controller.userDasboard)
route.get("/post/:id", Controller.detailPost)


//Profile Page
route.get("/:id/profile",loginCheck, Controller.showUserProfile)
route.get("/:id/profile/edit",loginCheck, Controller.showEditprofile)
route.post("/:id/profile/edit",loginCheck, Controller.X)



//Post



module.exports = route