'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherGift extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       models.VoucherGift.belongsTo(models.countries, { foreignKey: "CountryId" });

    }
  }
  VoucherGift.init({
    VoucherName: DataTypes.STRING,
    CountryId: DataTypes.INTEGER,
    VoucherCurrency: DataTypes.ENUM("0","1","2","3"),
    VoucherType: DataTypes.ENUM("0","1"),
    VoucherImage: DataTypes.STRING


    

  }, {
    sequelize,
    modelName: 'VoucherGift',
  });
  return VoucherGift;
};