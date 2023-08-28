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
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      experience_date: DataTypes.DATE,
      order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("published", "pending", "moderation", "deleted"),
        defaultValue: "pending",
        allowNull: true,
      },
      job_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING,

        allowNull: false,
      },
      merchant_id: {
        type: DataTypes.INTEGER,

        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      image_video: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "product_review",
      tableName: "product_review",
    }
  );
  return product_review;
};
