const express = require("express");
const router = express.Router();

const {
  creatReportResponse,
  getReportResponseById,
} = require("../controllers/ReportResponse.controller");


router.post("/response", creatReportResponse );

router.get("/responses/:reportId", getReportResponseById);

module.exports = router;
