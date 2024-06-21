'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userprofile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userprofile.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateNaissance: {
      type: DataTypes.DATE,
      allowNull: true
    },
    localAdress: {
      type: DataTypes.STRING,
      allowNull: true
    },
      zip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userWalletAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_rewards: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    level_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
     googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      currency: {
      type: DataTypes.ENUM('€', '$'),
      defaultValue: '€',
      allowNull: true
    },
    profile_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      
      twoFactorAuthEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      twoFactorAuthSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twoFactorAuthSecretTemp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      CodeLangSession: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  }, {
    sequelize,
    modelName: 'userprofile',
    tableName: 'userprofile'
  });
  return userprofile;
};