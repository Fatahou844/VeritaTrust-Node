const { Op } = require('sequelize');
const db = require('../models/index');

const updateMerchantProfileStats = async () => {
  try {
    const reviewsData = await db.merchant_review.findAll({
      attributes: [
        'merchant_id',
        [db.sequelize.fn('COUNT', '*'), 'ReviewNumber'],
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'MeanReview'],
      ],
      where: {
        status: 'published'
      },
      group: ['merchant_id'],
    });

    for (const reviewData of reviewsData) {
      const { merchant_id, ReviewNumber, MeanReview } = reviewData.dataValues;
      
      console.log("******************* Object reviewdata *****************");
      console.log(reviewData.dataValues)
      
      console.log("reviweNumber", ReviewNumber);
      console.log("MeanReview", MeanReview);
      console.log("merchant_id", MeanReview);

      await db.merchant_profile.update(
         { ReviewsNumber: ReviewNumber, ReviewMean: MeanReview },
        { where: { id: merchant_id } }
      );
    }

    console.log('Merchant profile stats updated successfully.');
  } catch (err) {
    console.log(err);
  }
};

const updateProductStats = async () => {
  try {
    const reviewsData = await db.product_review.findAll({
      attributes: [
        'product_id',
        [db.sequelize.fn('COUNT', '*'), 'ReviewNumber'],
        [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'MeanReview'],
      ],
      where: {
        status: 'published'
      },
      group: ['product_id'],
    });

    for (const reviewData of reviewsData) {
      const { product_id, ReviewNumber, MeanReview } = reviewData.dataValues;

      await db.products.update(
          { ReviewsNumber: ReviewNumber, ReviewMean: MeanReview },
          { where: { id: product_id } }
        );
    }

    console.log('Product stats updated successfully.');
  } catch (err) {
    console.log(err);
  }
};

const nodeCron = require('node-cron');
const merchantProfileJob = nodeCron.schedule('*/1 * * * *', updateMerchantProfileStats); // Executes daily at midnight
const productStatsJob = nodeCron.schedule('*/1 * * * *', updateProductStats); // Executes daily at midnight

module.exports = {
  merchantProfileJob,
  productStatsJob,
};
