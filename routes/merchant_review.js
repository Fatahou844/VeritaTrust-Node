var dbConn = require('../db.config');
var express = require('express');
var router = express.Router();
router.get('/merchant-review', function (req, res, next) {
  var sql = 'SELECT * FROM merchant_review';
  dbConn.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('merchant-review', {
      title: 'merchant reviews',
      merchantReviews: data
    });
  });
});
module.exports = router;