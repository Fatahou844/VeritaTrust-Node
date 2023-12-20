"use strict";
const { Model } = require("sequelize");
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
  endpoint_url.init(
    {
      endpoint: DataTypes.STRING,
      hash_urls: DataTypes.STRING,
      hash_url_product: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "endpoint_url",
    }
  );
  return endpoint_url;
};
