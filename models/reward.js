'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reward.init({
    Reward_type: DataTypes.ENUM("merchant_review","product_review"),
    User_id: DataTypes.INTEGER,
    job_id: DataTypes.STRING,
    reward_value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'reward',
  });
  return reward;
};