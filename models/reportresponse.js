'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReportResponse.init({
    ReportReviewId: DataTypes.INTEGER,
    SupportUserId: DataTypes.INTEGER,
    Message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportResponse',
  });
  return ReportResponse;
};