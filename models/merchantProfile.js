'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class merchant_profile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    merchant_profile.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
         } ,
        description: {
           type: DataTypes.STRING,
           allowNull: true
        } ,
        logo: {
            type: DataTypes.STRING,
            allowNull: true
        } ,
        corporate_name: DataTypes.STRING,
        phone: {
           type: DataTypes.STRING,
           allowNull: true
        },

        website:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true
        },
        merchant_user_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zip_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category_1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category_2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category_3: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_session: {
            type: DataTypes.DATE,
            allowNull: true
        },
        invitation_delay: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        invitation_delay_product_review: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    }, {
        sequelize,
        modelName: 'merchant_profile',
        tableName: 'merchant_profile'
    });
    return merchant_profile;
};