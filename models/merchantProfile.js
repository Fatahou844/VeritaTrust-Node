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
       merchant_profile.hasMany(models.merchant_review, {
        foreignKey: 'merchant_id',
        as: 'reviews'
      });
    }
  }
  merchant_profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    corporate_name: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    merchant_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country_id: {
      type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category_3: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
      PageViewsNb: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      
    Language_review_collecting: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      
    Data_to_collect: {
      type: DataTypes.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
    
    InviteFrequency: {
      type: DataTypes.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
    
     EmailToReplay: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
      SenderName: {
      type: DataTypes.STRING,
      allowNull: true
    },
      
  }, {
    sequelize,
    modelName: 'merchant_profile',
    tableName: 'merchant_profile'
  });
  return merchant_profile;
};