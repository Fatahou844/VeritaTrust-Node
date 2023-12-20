'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('merchant_profile', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      corporate_name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchant_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      country_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category_1: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category_2: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category_3: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      last_session: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      invitation_delay: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      invitation_delay_product_review: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ReviewsNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ReviewMean: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        allowNull: false,
      },
      
       status: {
      type: Sequelize.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
      PageViewsNb: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      
            
    Language_review_collecting: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      
    Data_to_collect: {
      type: Sequelize.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
    
    InviteFrequency: {
      type: Sequelize.ENUM('0','1','2','3'),
      defaultValue: '0',
      allowNull: true
    },
    
     EmailToReplay: {
      type: Sequelize.STRING,
      allowNull: true
    },
    
      SenderName: {
      type: Sequelize.STRING,
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
    await queryInterface.dropTable('merchant_profile');
  },
};
