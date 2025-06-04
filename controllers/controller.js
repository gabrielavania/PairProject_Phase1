const bcrypt = require('bcryptjs');
const { Op } = require("sequelize")
const {User,Profile} = require('../models');
class Controller {

    static async showLogin(req,res){
        try {
            
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
                    //SUCCESS LOGIN SUCCESSFULLY
                } else {
                    throw "Invalid Username or Password"
                }
            } else {
                throw "Invalid Username or Password"
            }

        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async showRegister(req,res){
        try {
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async actualRegister(req,res){
        try {
            let {username,password} = req.body
            await User.create({username,password})
            res.redirect()
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}

module.exports = Controller