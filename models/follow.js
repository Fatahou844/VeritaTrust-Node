"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  follow.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      follower_userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      following_userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: false,
      },
  
    },
    
    {
      sequelize,
      modelName: "follow",
      tableName: "follow",
      uniqueKeys: {
        unique_follow: {
          fields: ["follower_userId", "following_userId"],
        },
        unique_follow_reverse: {
          fields: ["following_userId", "follower_userId"],
        },
      },
    }
  );
  return follow;
};
