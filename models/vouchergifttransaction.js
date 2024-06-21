'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherGiftTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        models.VoucherGiftTransaction.belongsTo(models.userprofile, { foreignKey: "userId" });
        models.VoucherGiftTransaction.belongsTo(models.VoucherGift, { foreignKey: "VoucherGiftId" });
    }
  }
  VoucherGiftTransaction.init({
    VoucherGiftId: DataTypes.INTEGER,
    VoucherCode: DataTypes.STRING,
    Amount: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    status: DataTypes.ENUM('0','1','2')
  }, {
    sequelize,
    modelName: 'VoucherGiftTransaction',
  });
  return VoucherGiftTransaction;
};