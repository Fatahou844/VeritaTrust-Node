'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    merchant_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hash_transaction: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proofOfPurchase: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_state: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending',
      allowNull: true
    },
    transaction_state_2: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending',
      allowNull: true
    },
    transaction_state_3: {
      type: DataTypes.ENUM('pending', 'completed'),
      defaultValue: 'pending',
      allowNull: true
    },
     status: {
      type: DataTypes.ENUM('1', '0'),
      defaultValue: '1',
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'transaction',
    tableName: 'transaction'
  });
  return transaction;
};