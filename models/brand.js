'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
           models.Brand.belongsTo(models.categories, { foreignKey: "Category_id" });

    }
  }
  Brand.init({
    Category_id: DataTypes.INTEGER,
    Brand_name: DataTypes.STRING,
    Category: DataTypes.STRING,
    BrandLogo: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('0','1'),
        defaultValue: '0',
        allowNull: true,
      },

  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};