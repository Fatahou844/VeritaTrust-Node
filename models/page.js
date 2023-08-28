"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
   static associate(models) {
      this.hasMany(models.trackPage, {
        foreignKey: 'pageId',
        as: 'trackPages',
      });
  }

  }
  page.init(
    {
      pageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pageName: {
        type: DataTypes.STRING,
        allowNull: false,
        
      },
      pageType: {
        type: DataTypes.ENUM('home', 'authentication','merchant profile','product profile','category','account','user profile','review','other'),
        allowNull: false,
      },
      
      pageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
    },
    {
      sequelize,
      modelName: "page",
      tableName: "page",
    }
  );
  return page;
};
