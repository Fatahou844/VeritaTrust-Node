'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class merchant_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  merchant_profile.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    corporate_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    website: DataTypes.STRING,
    email: DataTypes.STRING,
    merchant_user_id: DataTypes.INTEGER,
    country_id: DataTypes.STRING,
    city: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    category_1: DataTypes.STRING,
    category_2: DataTypes.STRING,
    category_3: DataTypes.STRING,
    last_session: DataTypes.DATE,
    invitation_delay: DataTypes.INTEGER,
    invitation_delay_product_review: DataTypes.INTEGER,
    ReviewsNumber: DataTypes.INTEGER,
    ReviewMean: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'merchant_profile',
  });
  return merchant_profile;
};