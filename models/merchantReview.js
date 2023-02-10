'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class merchant_review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    merchant_review.init({
        rating: {
           type: DataTypes.INTEGER,
           allowNull: true
        } ,
        title: {
            type: DataTypes.STRING,
            allowNull: false
        } ,
        experience_date: DataTypes.DATE,
        order_id: DataTypes.STRING,
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
        merchant_id:{
            type: DataTypes.STRING,
            defaultValue: '4f6750685-6ee7-49dd-b9e8-1f204b13db6a',
            allowNull: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },

        
        
    }, {
        sequelize,
        modelName: 'merchant_review',
        tableName: 'merchant_review'
    });
    return merchant_review;
};