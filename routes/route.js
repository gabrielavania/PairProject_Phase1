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

//Profile Page
// route.get("/:id/profile", Controller.X)
// route.get("/:id/profile/edit", Controller.X)
// route.post("/:id/profile/edit", Controller.X)

//Dashboard
route.get("/dashboard", Controller.userDasboard)

//Post
route.get("/post/:id", Controller.detailPost)
route.post("/post/:id", Controller.detailPost)

//Comment
route.post('/post/:id/comment', Controller.addComment);


module.exports = route