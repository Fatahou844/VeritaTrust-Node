"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Subscriptions.belongsTo(models.merchant_profile, {
        foreignKey: "merchandId",
      });
    }
  }
  Subscriptions.init(
    {
      merchandId: DataTypes.INTEGER,
      subscriptionPlan: DataTypes.ENUM("0", "1", "2"),
      expirationDate: DataTypes.DATE,
      apiToken: DataTypes.STRING,
      status: DataTypes.ENUM("0", "1", "2", "3"),
      MonthlyReview: DataTypes.INTEGER,
      EmailInviteCustom: DataTypes.BOOLEAN,
      CustomerSupport: DataTypes.ENUM("0", "1", "2"),
      InviteFromPastCustomers: DataTypes.INTEGER,
      dashboard: DataTypes.ENUM("0", "1", "2"),
      QandAonProductPage: DataTypes.BOOLEAN,
      LocalReviews: DataTypes.BOOLEAN,
      MultiUserDomain: DataTypes.ENUM("0", "1", "2"),
      NetPromoterScore: DataTypes.BOOLEAN,
      GoogleShoppingSEOReviewWidget: DataTypes.BOOLEAN,
      StripeSubscriptionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Subscriptions",
    }
  );
  return Subscriptions;
};
