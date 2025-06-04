const bcrypt = require('bcryptjs');
const { Op } = require("sequelize")
const {User,Profile} = require('../models');
class Controller {

    static async showHome(req,res){
        try {
            res.render("home")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showLogin(req,res){
        try {
            res.render("loginPage")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualLogin(req,res){
        try {
            let {username,password} = req.body
            let loginCredentials = await User.findOne({
                where : {
                    username
                }
            })
            if(loginCredentials){
                let validPassword = await bcrypt.compare(password,loginCredentials.password)
                if(validPassword){
                    //SUCCESS LOGIN SUCCESSFULLY NEED TO RENDER / REDIRECT
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

    static async showRegister(req,res){
        try {
            res.render("registerPage")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualRegister(req,res){
        try {
            let {username,password} = req.body
            await User.create({username,password})
            res.redirect("/login")
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async createProfile(req,res){
        try {
            res.render()
        } catch (error) {
            console.log(error);
            res.redirect(error)
        }
    }
}

module.exports = Controller