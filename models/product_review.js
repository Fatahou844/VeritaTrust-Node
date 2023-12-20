"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_review.init(
    {
      product_id: DataTypes.STRING,
      product_name: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      title: DataTypes.STRING,
      experience_date: DataTypes.DATE,
      order_id: DataTypes.STRING,
      status: DataTypes.ENUM("published", "pending", "moderation", "deleted"),
      job_id: DataTypes.STRING,
      user_id: DataTypes.STRING,
      merchant_id: DataTypes.STRING,
      content: DataTypes.STRING,
      image_video: DataTypes.STRING,
      lang_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "product_review",
    }
  );
  return product_review;
};
