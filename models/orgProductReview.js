'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class organic_product_review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    organic_product_review.init({
        product_name: {
            type: DataTypes.STRING,
            allowNull: true
         } ,
        rating: {
           type: DataTypes.INTEGER,
           allowNull: true
        } ,
        title: {
            type: DataTypes.STRING,
            allowNull: false
        } ,
        experience_date: DataTypes.DATE,
        status: {
           type: DataTypes.ENUM('published','pending','moderation','deleted'),
           defaultValue: 'published',
           allowNull: true
        },

        job_id:{
            type: DataTypes.STRING,
            allowNull: true
        },
        user_id:{
            type: DataTypes.STRING,
            defaultValue: '03916e0d-2fbe-4ab3-90de-95b2ad24b87d',
            allowNull: true
        },
        product_id:{
            type: DataTypes.STRING,
            allowNull: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_video: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hash_transaction: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        sequelize,
        modelName: 'organic_product_review',
        tableName: 'organic_product_review'
    });
    return organic_product_review;
};