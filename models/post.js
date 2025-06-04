'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Category, { foreignKey: 'category_id' });
      Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,    
    user_id: DataTypes.INTEGER,
    upvotes: DataTypes.INTEGER,
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Category",
        key: "id"
      }
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};