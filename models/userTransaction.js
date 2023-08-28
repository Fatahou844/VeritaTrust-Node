'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userTransaction.init({
     status: {
      type: DataTypes.ENUM('published', 'pending','rejected'),
      defaultValue: 'pending',
      allowNull: true
    },
    
    type: {
      type: DataTypes.ENUM('crypto', 'voucher'),
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dateTransaction: {
      type: DataTypes.DATE,
      allowNull: true
    },
    veritacoins: {
      type: DataTypes.STRING,
      allowNull: true
    },
    voucherValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    voucherWebsite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cryptoValue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cryptoCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wallet_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
   user_id: {
      type: DataTypes.STRING,
      defaultValue: '03916e0d-2fbe-4ab3-90de-95b2ad24b87d',
      allowNull: true
    },
 
  }, {
    sequelize,
    modelName: 'userTransaction',
    tableName: 'userTransaction'
  });
  return userTransaction;
};