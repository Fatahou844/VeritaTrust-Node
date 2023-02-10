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
        }
    }
    products.init({
        aw_image_url: {
            type: DataTypes.STRING,
            allowNull: true
         } ,
         aw_thumb_url: {
            type: DataTypes.STRING,
            allowNull: false
         } ,
         category_name: {
           type: DataTypes.STRING,
           allowNull: true
        } ,
        merchant_category: {
            type: DataTypes.STRING,
            allowNull: false
        } ,
        ean: DataTypes.STRING,
        model_number: DataTypes.STRING,
        product_name: {
           type: DataTypes.STRING,
            allowNull: true
        },

        description:{
            type: DataTypes.STRING,
            allowNull: true
        },
        merchant_image_url:{
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'products',
        tableName: 'products'
    });
    return products;
};