"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LastReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LastReview.init(
    {
      lastReviewId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      LastReviewSubmitDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: "LastReview",
      tableName: "LastReview",
    }
  );
  return LastReview;
};
