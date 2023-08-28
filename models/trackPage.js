"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class trackPage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.page, {
        foreignKey: 'pageId',
        as: 'page',
      });
  }

  }
  trackPage.init(
    {
      trackPageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
     
    },
    {
      sequelize,
      modelName: "trackPage",
      tableName: "trackPage",
    }
  );
  return trackPage;
};
