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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      experience_date: DataTypes.DATE,
      order_id: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("published", "pending", "moderation", "deleted"),
        defaultValue: "pending",
        allowNull: true,
      },
      isAnswered: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        allowNull: true,
      },

      addShowCase: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        allowNull: true,
      },

      favorite: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
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
    },
    {
      sequelize,
      modelName: "merchant_review",
      tableName: "merchant_review",
    }
  );
  return merchant_review;
};
