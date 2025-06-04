const { User, Profile } = require("../models")
const { Op } = require("sequelize")

class Controller {
   static async X(req,res) {
       try {
           
       } catch (error) {
           console.log(error)
           res.send(error)
       }
   }
}

module.exports = Controller