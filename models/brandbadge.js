'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brandBadge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
           models.brandBadge.belongsTo(models.Brand, { foreignKey: "brandId" });
         models.brandBadge.belongsTo(models.userprofile, { foreignKey: "userId" });


    }
  }
  brandBadge.init({
    userId: DataTypes.INTEGER,
    brandId: DataTypes.INTEGER,
    status: DataTypes.ENUM('0','1')
  }, {
    sequelize,
    modelName: 'brandBadge',
  });
  return brandBadge;
};