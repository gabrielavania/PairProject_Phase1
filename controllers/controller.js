const bcrypt = require('bcryptjs');
const { Op } = require("sequelize")
const { User, Profile, Post, Categories, Comment } = require('../models');
const { noPwd } = require('../helpers/helpers');

class Controller {

    static async X(req, res) {
        try {
            res.send("Hello")
        } catch (error) {
            res.send(error)
        }
    }
//HOME ROUTE
    static async showHome(req, res) {
        try {
            let userLogOn
            userLogOn = req.session.username
            res.render("home", { userLogOn })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    //AUTH ROUTES
    static async showLogin(req, res) {
        try {
            let { logout,required } = req.query
            res.render("loginPage", { logout,required })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualLogin(req, res) {
        try {
            let { username, password } = req.body
            let loginCredentials = await User.findOne({
                where: {
                    username
                }
            })
            if (loginCredentials) {
                let validPassword = await bcrypt.compare(password, loginCredentials.password)
                if (validPassword) {
                    //SAVE SESSIONS HERE
                    req.session.userId = loginCredentials.id
                    req.session.username = loginCredentials.username
                    res.redirect("/")
                } else {
                    throw "Invalid Username or Password"
                }
            } else {
                //FAILED LOGIN PERLU NEED TO / REDIRECT
                throw "Invalid Username or Password"
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async logOut(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.log("Cannot logout lmao");
                    console.log(err);
                    throw err
                }
                res.redirect(`/login?logout=success`)
            })
        } catch (error) {
            console.log();
            res.send(error)
        }
    }

    static async showRegister(req, res) {
        try {
            res.render("registerPage")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualRegister(req, res) {
        try {
            let { username, password } = req.body
            await User.create({ username, password })
            res.redirect("/login")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    //PROFILE ROUTES

    static async showUserProfile(req, res) {
        try {

            const userId = req.userId
            let data = await Profile.findOne({
                where : {user_id : userId},
                include : User
            }
        )
            if(!data){
                throw "Profile not found"
            }
            res.render("userProfile",{ data })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showEditprofile(req, res) {
        try {
            const userId = req.userId
            let data = await Profile.findOne({
                where : {
                    user_id : userId
                },
                include : User
            })

            let plainData = data.get({plain:true})
            plainData.User = noPwd(plainData.User)
            // console.log(JSON.stringify(plainData,null,2));
            
            
            
            // res.render("editProfile", { data })
            res.send(plainData)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async saveEditProfile(req, res) {
        try {
            let { id } = req.params
            let { name, email, discordId } = req.body
            await Profile.create({
                name, email, discordId
            })
            res.redirect(`/profile/${id}`)
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async userDasboard(req, res) {
        try {
            const posts = await Post.findAll()

            res.render("userDasboard", { posts })
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }

    static async detailPost(req, res) {
        try {
            const { id } = req.params
            const posts = await Post.findByPk(+id)

            const comments = await Comment.findAll({
                where: { post_id: id }
            })
            // console.log(posts)

            res.render("detailPost", { posts, comments, id })
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }


}

module.exports = Controller