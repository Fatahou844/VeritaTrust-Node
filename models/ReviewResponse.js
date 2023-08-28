"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReviewResponse.init(
    {
      ReviewId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ReviewType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
      merchantUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    
     content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: "ReviewResponse",
      tableName: "ReviewResponse",
    }
  );
  return ReviewResponse;
};
