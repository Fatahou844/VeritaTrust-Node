'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Définition of the association between the categories and their children categories
            categories.hasMany(models.categories, {
               foreignKey: {
                   name: 'category_parent_id',
                   allowNull: true
               },
                as: 'sub_categories',
                constraints: false
            });
            // Définition of the association between the categories and their parent categories
        }
    }
    categories.init({

        vt_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        google_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        category_parent_id: {
          type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: categories,
                key: 'google_category_id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }

    }, {
        sequelize,
        modelName: 'categories',
        tableName: 'vt_categories'
    });
    return categories;
};