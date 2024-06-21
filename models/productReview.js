'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
          models.product_review.belongsTo(models.userprofile, { foreignKey: "user_id" });
      models.product_review.belongsTo(models.merchant_profile, { foreignKey: "merchant_id" });
      models.product_review.belongsTo(models.products, { foreignKey: "product_id" });
    }
  }
  product_review.init({
    product_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience_date: DataTypes.DATE,
    order_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('published', 'pending', 'moderation', 'deleted'),
      defaultValue: 'pending',
      allowNull: true
    },
     source: {
      type: DataTypes.ENUM('0', '1'),
      defaultValue: '0',
      allowNull: true
    },
     isAnswered: {
      type: DataTypes.ENUM('0', '1'),
      defaultValue: '0',
      allowNull: true
    },
    
    addShowCase: {
      type: DataTypes.ENUM('0', '1'),
      defaultValue: '0',
      allowNull: true
    },
    
    favorite: {
      type: DataTypes.ENUM('0', '1'),
      defaultValue: '0',
      allowNull: true
    },
    
    job_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING,
      defaultValue: '03916e0d-2fbe-4ab3-90de-95b2ad24b87d',
      allowNull: true
    },
    lang_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    merchant_id: {
      type: DataTypes.STRING,
      defaultValue: '4f6750685-6ee7-49dd-b9e8-1f204b13db6a',
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    image_video: {
      type: DataTypes.STRING(1024),
      defaultValue:"https://res.cloudinary.com/dnbpmsofq/image/upload/v1693389293/cimc4wol5dpfrjcsmxvs.gif",
      allowNull: true
    },
    proof_purchase: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'product_review',
    tableName: 'product_review'
  });
  return product_review;
};