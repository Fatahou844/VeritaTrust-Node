'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class supportMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  supportMessage.init({

    issueType: {
      type: DataTypes.ENUM('account', 'review', 'reward', 'payment','other'),
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
   image: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
      status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false
    },
    reportReviewId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isWritingBy: {
      type: DataTypes.ENUM('user', 'support'),
      allowNull: true
    },
    
  }, {
    sequelize,
    modelName: 'supportMessage',
    tableName: 'supportMessage'
  });
  return supportMessage;
};