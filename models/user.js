'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: "user_id"
      })
      User.hasMany(models.Comment, {
        foreignKey: "user_id"
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : {
        name:"unique-username",
        msg :"Username has already been taken"
      },
      validate : {
        notEmpty : {
          msg : "Username cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        len : {
          args:[8],
          msg:"Password must be minimum 8 characters long"
        }
      }

    },
    role: {
      type: DataTypes.STRING

    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10)

        if (!user.role) {
          user.role = "student";
        }

      },
      afterCreate: async (user) => {
        const { Profile } = sequelize.models
        await Profile.create({
          user_id: user.id,
          email: '',
          name: '',
          discordId: '',
          imageURL: '/images/default-avatar.png'
        })
      }
    }
  });
  return User;
};