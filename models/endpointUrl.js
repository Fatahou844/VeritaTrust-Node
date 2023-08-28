'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class endpoint_url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  endpoint_url.init({
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash_urls: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash_url_product: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'endpoint_url',
    tableName: 'endpoint_url'
  });
  return endpoint_url;
};