const { Op } = require('sequelize');
const db = require('../models/index');

const updateLevelAccount = async () => {
  try {
    const reviewsCount = await db.merchant_review.count({
      where: { status: 'published' },
      group: ['user_id'],
      attributes: ['user_id', [db.sequelize.fn('COUNT', '*'), 'review_count']],
    });

    const productReviewsCount = await db.product_review.count({
      where: { status: 'published' },
      group: ['user_id'],
      attributes: ['user_id', [db.sequelize.fn('COUNT', '*'), 'product_review_count']],
    });

    const mergedCounts = reviewsCount.concat(productReviewsCount);
    const userReviewCounts = mergedCounts.reduce((acc, count) => {
      const { user_id, review_count = 0, product_review_count = 0 } = count;
      acc[user_id] = (acc[user_id] || 0) + review_count + product_review_count;
      return acc;
    }, {});

    const userIDs = Object.keys(userReviewCounts);

    for (const userID of userIDs) {
      const reviewCount = userReviewCounts[userID];

      let levelAccount;
      if (reviewCount < 5) {
        levelAccount = 0;
      } else if (reviewCount < 20) {
        levelAccount = 1;
      } else if (reviewCount < 50) {
        levelAccount = 2;
      } else if (reviewCount < 100) {
        levelAccount = 3;
      } else {
        levelAccount = 4;
      }

      await db.userprofile.update(
        { level_account: levelAccount },
        { where: { id: userID } }
      );
    }

    console.log('Level accounts updated successfully.');
  } catch (err) {
    console.log(err);
  }
};

const nodeCron = require('node-cron');
const job = nodeCron.schedule('*/1 * * * *', updateLevelAccount);

module.exports.job = job;
