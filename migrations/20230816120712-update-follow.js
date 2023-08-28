'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('follow', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      follower_userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      following_userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('0', '1'),
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

    await queryInterface.addConstraint('follow', {
      type: 'unique',
      fields: ['follower_userId', 'following_userId'],
      name: 'unique_follow'
    });

    await queryInterface.addConstraint('follow', {
      type: 'unique',
      fields: ['following_userId', 'follower_userId'],
      name: 'unique_follow_reverse'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('follow');
  },
};
