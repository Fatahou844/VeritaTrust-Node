'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('merchant_review', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      experience_date: {
        type: Sequelize.DATE,
      },
      order_id: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('published', 'pending', 'moderation', 'deleted'),
        defaultValue: 'pending',
        allowNull: true,
      },
       source: {
      type: Sequelize.ENUM('0', '1'),
      defaultValue: '0',
      allowNull: true
    },
      isAnswered: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        allowNull: true,
      },
      addShowCase: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        allowNull: true,
      },
      favorite: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        allowNull: true,
      },
      job_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING,
        defaultValue: '03916e0d-2fbe-4ab3-90de-95b2ad24b87d',
        allowNull: true,
      },
         lang_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
      merchant_id: {
        type: Sequelize.STRING,
        defaultValue: '4f6750685-6ee7-49dd-b9e8-1f204b13db6a',
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING(2048),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('merchant_review');
  },
};
