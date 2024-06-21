'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       products.hasMany(models.product_review, {
        foreignKey: 'product_id',
        as: 'reviews'
      });
     models.products.belongsTo(models.Brand, { foreignKey: "Brand_id" });
     models.products.belongsTo(models.categories, { foreignKey: "category_id" });

    }
  }
  products.init({
    aw_image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aw_thumb_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Brand_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    merchant_category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ean: DataTypes.STRING,
    model_number: DataTypes.STRING,
    product_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    merchant_image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    ReviewsNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    ReviewMean: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
        status: {
        type: DataTypes.ENUM('0','1'),
        defaultValue: '0',
        allowNull: true,
      },
      
    PageViewsNb: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
  }, {
    sequelize,
    modelName: 'products',
    tableName: 'products'
  });
  return products;
};