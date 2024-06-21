'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categorieBadge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
                 models.categorieBadge.belongsTo(models.categories, { foreignKey: "categorieId" });
                models.categorieBadge.belongsTo(models.userprofile, { foreignKey: "userId" });


    }
  }
  categorieBadge.init({
    userId: DataTypes.INTEGER,
    categorieId: DataTypes.INTEGER,
    status: DataTypes.ENUM('0','1')
  }, {
    sequelize,
    modelName: 'categorieBadge',
  });
  return categorieBadge;
};