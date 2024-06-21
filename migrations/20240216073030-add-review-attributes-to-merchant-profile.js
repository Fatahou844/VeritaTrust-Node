'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('merchant_profile', 'CollectingReviews', {
      type: Sequelize.ENUM('0','1'),
      allowNull: true,
      defaultValue: '0' // Vous pouvez ajuster la valeur par défaut selon vos besoins
    });

    await queryInterface.addColumn('merchant_profile', 'DisplayingReviews', {
      type: Sequelize.ENUM('0','1'),
      allowNull: true,
      defaultValue: '0' // Vous pouvez ajuster la valeur par défaut selon vos besoins
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('merchant_profile', 'CollectingReviews');
    await queryInterface.removeColumn('merchant_profile', 'DisplayingReviews');
  }
};

