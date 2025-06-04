const express = require('express')
const Controller = require('../controllers/controller')
const { loginCheck } = require('../middlewares/loginCheck')
const upload = require('../middlewares/multer')
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
route.get("/profile/",loginCheck, Controller.showUserProfile)
route.get("/profile/edit",loginCheck, Controller.showEditprofile)
route.post("/profile/edit",loginCheck,upload.single("image"), Controller.saveEditProfile)

//Dashboard
route.get("/dashboard", Controller.userDasboard)

//Post
route.get("/post/:id", Controller.detailPost)
route.post("/post/:id", Controller.detailPost)

//Comment
route.post('/post/:id/comment', Controller.addComment);


module.exports = route
