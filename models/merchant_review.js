"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class merchant_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  merchant_review.init(
    {
      rating: DataTypes.INTEGER,
      title: DataTypes.STRING,
      experience_date: DataTypes.DATE,
      order_id: DataTypes.STRING,
      status: DataTypes.ENUM("published", "pending", "moderation", "deleted"),
      isAnswered: DataTypes.ENUM("0", "1"),
      addShowCase: DataTypes.ENUM("0", "1"),
      favorite: DataTypes.ENUM("0", "1"),
      job_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      merchant_id: DataTypes.STRING,
      content: DataTypes.STRING,
      lang_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "merchant_review",
    }
  );
  return merchant_review;
};
