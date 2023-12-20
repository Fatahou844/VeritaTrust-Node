"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userprofile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userprofile.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      dateNaissance: DataTypes.DATE,
      localAdress: DataTypes.STRING,
      zip: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      userWalletAddress: DataTypes.STRING,
      total_rewards: DataTypes.INTEGER,
      level_account: DataTypes.INTEGER,
      facebookId: DataTypes.STRING,
      token: DataTypes.STRING,
      googleId: DataTypes.STRING,
      verification_token: DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      currency: DataTypes.ENUM("0", "1"),
      profile_url: DataTypes.STRING,
      twoFactorAuthEnabled: DataTypes.BOOLEAN,
      twoFactorAuthSecret: DataTypes.STRING,
      twoFactorAuthSecretTemp: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "userprofile",
    }
  );
  return userprofile;
};
