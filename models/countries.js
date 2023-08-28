'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class countries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
           
        }
    }
    countries.init({

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
       name_en: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
        
           name_fr: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
            name_es: {
            type: DataTypes.STRING,
            allowNull: false,
         
        },
            name_it: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
            name_de: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
      

    }, {
        sequelize,
        modelName: 'countries',
        tableName: 'countries'
    });
    return countries;
};