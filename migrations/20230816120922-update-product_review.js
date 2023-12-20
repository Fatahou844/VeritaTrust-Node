'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_review', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
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
        allowNull: true,
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
      image_video: {
        type: Sequelize.STRING(1024),
        defaultValue:"https://res.cloudinary.com/dnbpmsofq/image/upload/v1693389293/cimc4wol5dpfrjcsmxvs.gif",
        allowNull: true,
      },
       proof_purchase: {
          type: Sequelize.STRING(1024),
          allowNull: true
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
    await queryInterface.dropTable('product_review');
  },
};
