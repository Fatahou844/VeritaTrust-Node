'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReportReview.init({
    reportUserId: DataTypes.INTEGER,
    reportSource: DataTypes.ENUM('merchant','user'),
    motif: DataTypes.ENUM('duplicate','spam','profanity','other'),
    status: DataTypes.ENUM('0','1','2'),
    reviewType: DataTypes.ENUM('merchant_review','product_review'),
    reviewId: DataTypes.INTEGER,
    content: DataTypes.STRING(2048)
  }, {
    sequelize,
    modelName: 'ReportReview',
  });
  return ReportReview;
};