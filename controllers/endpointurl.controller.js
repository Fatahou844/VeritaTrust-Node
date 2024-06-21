"use strict";

const { response } = require("express");

const { body, validationResult, param } = require("express-validator");
const db = require("../models/index");
const endpoint_url = db.endpoint_url;
exports.findAll = function (req, res) {
  endpoint_url.findAll(function (err, endpoint_url) {
    console.log("controller");
    if (err) res.send(err);
    else {
      console.log("res", endpoint_url);
      const filters = req.query;
      const filteredUsers = endpoint_url.filter((user) => {
        let isValid = true;
        for (var key in filters) {
          var keys_filr = filters[key].toString().split(",");
          if (key === "created_at") {
            const date1 = new Date(keys_filr[0].toString());
            const date2 = new Date(keys_filr[1].toString());
            const date_user = new Date(user[key].toString());
            isValid =
              isValid &&
              date_user.getTime() >= date1.getTime() &&
              date_user.getTime() <= date2.getTime();
          } else if (key === "search") {
            var desci = user["description"]
              .toString()
              .search(keys_filr[0].toString());
            var value = false;
            if (desci >= 0) value = true;
            else value = false;
            isValid = isValid && value;
          } else isValid = isValid && keys_filr.includes(user[key].toString());
        }
        return isValid;
      });
      res.send(filteredUsers);
      //res.send(endpoint_url);
    }
  });
};

const validateTransaction = [
  body("hash_urls").isString().withMessage("hash_urls must be a string"),
  body("endpoint").isString().withMessage("endpoint  be a string"),
  body("hash_url_product")
    .isString()
    .withMessage("hash_url_product must be a string"),
];

exports.createendpointurl = [
  ...validateTransaction,
  async (req, res) => {
    //create user
    var data = userprofile.create({
      endpoint: req.body.endpoint,
      hash_urls: req.body.hash_urls,
      hash_url_product: req.body.hash_url_product,
    });
    return data;
  },
];

exports.getMerchants = function (req, res) {
  endpoint_url.findAll().then((user) => {
    if (user) {
      res.status(200).json(user);
    }
    //if productreview not created, send error
    else {
      res.status(400).send("error to select");
    }
  });
};
exports.getUserByWebsite = async function (req, res) {
  var data = await endpoint_url.findOne({
    where: {
      website: "www.store.fatasoft-consulting.com",
    },
  });
  return data;
};
exports.create = function (req, res) {
  const new_endpoint_url = new endpoint_url(req.body);
  //handles null error
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    endpoint_url.create(new_endpoint_url, function (err, endpoint_url) {
      if (err) res.send(err);
      res.json({
        error: false,
        message: "endpoint_url added successfully!",
        data: endpoint_url,
      });
    });
  }
};
exports.findByWebsite = function (req, res) {
  endpoint_url.findByWebsite(req.params.website, function (err, endpoint_url) {
    if (err) res.send(err);
    res.json(endpoint_url);
  });
};
exports.update = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({
      error: true,
      message: "Please provide all required field",
    });
  } else {
    endpoint_url.update(
      req.params.id,
      new endpoint_url(req.body),
      function (err, endpoint_url) {
        if (err) res.send(err);
        res.json({
          error: false,
          message: "endpoint_url successfully updated",
        });
      }
    );
  }
};
exports.delete = function (req, res) {
  endpoint_url.delete(req.params.id, function (err, endpoint_url) {
    if (err) res.send(err);
    res.json({
      error: false,
      message: "endpoint_url successfully deleted",
    });
  });
};
