'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CashFlowReward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.CashFlowReward.belongsTo(models.userprofile, { foreignKey: "userId" });
    }
  }
  CashFlowReward.init({
    TotalInflow: {type: DataTypes.FLOAT,  defaultValue: 0},
    TotalCashflow: {type: DataTypes.FLOAT,  defaultValue: 0},
    TotalAmountPending: {type: DataTypes.FLOAT,  defaultValue: 0},
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CashFlowReward',
  });
  return CashFlowReward;
};