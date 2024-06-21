"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      if (models.product_review && models.merchant_review) {
    // Si les modèles ProductReview et MerchantReview existent
          ReviewResponse.belongsTo(models.product_review, {
              foreignKey: 'ReviewId',
              constraints: false, // Désactiver les contraintes pour permettre la clé étrangère conditionnelle
              scope: {
                ReviewType: 'product_review', // Condition pour la clé étrangère
              },
            });
        
            ReviewResponse.belongsTo(models.merchant_review, {
              foreignKey: 'ReviewId',
              constraints: false, // Désactiver les contraintes pour permettre la clé étrangère conditionnelle
              scope: {
                ReviewType: 'merchant_review', // Condition pour la clé étrangère
              },
            });
          }
    }
  }
  ReviewResponse.init(
    {
      ReviewId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ReviewType: {
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
          isIn: [['product_review', 'merchant_review']],
        },
      },
      
      merchantUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    
     content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: "ReviewResponse",
      tableName: "ReviewResponse",
    }
  );
  return ReviewResponse;
};
